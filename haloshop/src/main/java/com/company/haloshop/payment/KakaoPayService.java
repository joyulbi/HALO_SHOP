// KakaoPayService 구조변경: 주문 insert를 approve 단계에서 수행하여 포인트 부족 시 주문이 DB에 남지 않도록 개선

package com.company.haloshop.payment;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.order.OrderMapper;
import com.company.haloshop.payment.dto.PaymentApproveRequest;
import com.company.haloshop.payment.dto.PaymentCancelRequest;
import com.company.haloshop.payment.dto.PaymentReadyRequest;
import com.company.haloshop.pointlog.PointLogService;
import com.company.haloshop.userpoint.UserPointService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoPayService {

    private final OrderMapper orderMapper;
    private final UserPointService userPointService;
    private final PointLogService pointLogService;
    private final RestTemplate restTemplate = new RestTemplate();

    //@Value("${kakao.pay.admin-key}")
    private String adminKey;

    //@Value("${kakao.pay.cid}")
    private String cid;

    // ✅ 결제 준비: UUID 기반 tempOrderId 반환 (주문 insert X)
    public Map<String, Object> ready(PaymentReadyRequest request) {
        String tempOrderId = UUID.randomUUID().toString();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "KakaoAK " + adminKey);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("partner_order_id", tempOrderId);
        params.add("partner_user_id", request.getAccountId().toString());
        params.add("item_name", "HaloShop 결제");
        params.add("quantity", "1");
        params.add("total_amount", String.valueOf(request.getPayAmount()));
        params.add("tax_free_amount", "0");
        params.add("approval_url", "http://localhost:8080/api/payment/approve-success?tempOrderId=" + tempOrderId);
        params.add("cancel_url", "http://localhost:8080/api/payment/cancel");
        params.add("fail_url", "http://localhost:8080/api/payment/fail");

        HttpEntity<MultiValueMap<String, String>> httpRequest = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://kapi.kakao.com/v1/payment/ready",
                httpRequest,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        log.info("KakaoPay Ready Response: {}", body);

        Map<String, Object> result = new HashMap<>();
        result.put("next_redirect_pc_url", body.get("next_redirect_pc_url"));
        result.put("tid", body.get("tid"));
        result.put("tempOrderId", tempOrderId);

        return result;
    }

    // ✅ 결제 승인 + 주문 insert + 포인트 차감/적립 (원자 처리)
    @Transactional
    public void approve(PaymentApproveRequest request) {
        // KakaoPay 승인 요청
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "KakaoAK " + adminKey);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("tid", request.getTid());
        params.add("partner_order_id", request.getTempOrderId());
        params.add("partner_user_id", request.getAccountId().toString());
        params.add("pg_token", request.getPgToken());

        HttpEntity<MultiValueMap<String, String>> httpRequest = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://kapi.kakao.com/v1/payment/approve",
                httpRequest,
                Map.class
        );

        log.info("KakaoPay Approve Response: {}", response.getBody());

        // ✅ 주문 insert (결제 승인 후 최초 DB 등록)
        OrderDto order = new OrderDto();
        order.setAccountId(request.getAccountId());
        order.setPayAmount(request.getPayAmount());
        order.setTotalPrice(request.getTotalPrice());
        order.setUsed("KAKAO+POINT");
        order.setPaymentStatus("PAID");
        order.setTid(request.getTid());


        orderMapper.insert(order);
        log.info("주문 등록 완료: Order ID={}, User ID={}", order.getId(), request.getAccountId());

        // ✅ 포인트 사용 처리 (포인트 부족시 예외 → 전체 롤백)
        if (request.getUsedPoint() != null && request.getUsedPoint() > 0) {
            userPointService.usePoint(request.getAccountId(), request.getUsedPoint());
            pointLogService.saveLog(request.getAccountId(), "USE", request.getUsedPoint());
            log.info("포인트 사용 완료: {}P, User ID={}", request.getUsedPoint(), request.getAccountId());
        }

        // ✅ 포인트 적립 및 로그 기록
        int savePoint = userPointService.updateUserPointAndGrade(request.getAccountId(), request.getTotalPrice());
        pointLogService.saveLog(request.getAccountId(), "SAVE", savePoint);
        log.info("포인트 적립 완료: {}P, User ID={}", savePoint, request.getAccountId());
    }
    @Transactional
    public void cancel(PaymentCancelRequest request) {
        OrderDto order = orderMapper.findById(request.getOrderId());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "KakaoAK " + adminKey);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("tid", order.getTid());
        params.add("cancel_amount", order.getTotalPrice().toString());
        params.add("cancel_tax_free_amount", "0");

        HttpEntity<MultiValueMap<String, String>> httpRequest = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://kapi.kakao.com/v1/payment/cancel",
                httpRequest,
                Map.class
        );

        log.info("KakaoPay Cancel Response: {}", response.getBody());

        // 주문 상태를 CANCELLED로 업데이트
        orderMapper.updateStatus(order.getId(), "CANCELLED");

        // 적립된 포인트 회수
        int refundPoint = userPointService.deductPointByOrder(order.getAccountId(), order.getTotalPrice());
        pointLogService.saveLog(order.getAccountId(), "REFUND_DEDUCT", refundPoint);
        log.info("포인트 회수 완료: {}P, User ID: {}", refundPoint, order.getAccountId());

        // 사용한 포인트 복원
        if (order.getAmount() != null && order.getAmount() > 0) {
            userPointService.restorePoint(order.getAccountId(), order.getAmount());
            pointLogService.saveLog(order.getAccountId(), "REFUND_RESTORE", order.getAmount());
            log.info("사용 포인트 복원 완료: {}P, User ID: {}", order.getAmount(), order.getAccountId());
        }
    }

}
