package com.company.haloshop.payment;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.company.haloshop.cart.CartService;
import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.dto.shop.OrderItemDto;
import com.company.haloshop.order.OrderMapper;
import com.company.haloshop.order.OrderService;
import com.company.haloshop.orderitem.OrderItemMapper;
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
    private final OrderService orderService;
    private final UserPointService userPointService;
    private final PointLogService pointLogService;
    private final OrderItemMapper orderItemMapper;
    private final CartService cartService;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${kakao.pay.admin-key}")
    private String adminKey;

    @Value("${kakao.pay.cid}")
    private String cid;

    @PostConstruct
    public void checkAdminKey() {
        log.info("✅ KakaoPay adminKey={}", adminKey);
        log.info("✅ KakaoPay cid={}", cid);
    }

    public Map<String, Object> ready(PaymentReadyRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "KakaoAK " + adminKey);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("partner_order_id", String.valueOf(request.getAccountId()));
        params.add("partner_user_id", request.getAccountId().toString());
        params.add("item_name", "HaloShop 결제");
        params.add("quantity", "1");
        params.add("total_amount", String.valueOf(request.getPayAmount()));
        params.add("tax_free_amount", "0");
        params.add("approval_url", "http://localhost:3000/payment/success?accountId=" + request.getAccountId());
        params.add("cancel_url", "http://localhost:8080/api/payment/cancel");
        params.add("fail_url", "http://localhost:8080/api/payment/fail");

        HttpEntity<MultiValueMap<String, String>> httpRequest = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://kapi.kakao.com/v1/payment/ready",
                httpRequest,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        String tid = (String) body.get("tid");

        OrderDto order = new OrderDto();
        order.setTid(tid);
        order.setAccountId(request.getAccountId());
        order.setPayAmount(request.getPayAmount());
        order.setTotalPrice(request.getTotalPrice());
        order.setUsed("KAKAO+POINT");
        order.setPaymentStatus("PENDING");
        order.setAmount(request.getAmount());

        orderMapper.insert(order);
        Long orderId = order.getId();

        // ✅ 주문 아이템 함께 insert
        List<OrderItemDto> orderItems = request.getOrderItems();
        if (orderItems == null || orderItems.isEmpty()) {
            throw new IllegalArgumentException("주문 아이템이 없습니다.");
        }
        for (OrderItemDto item : orderItems) {
            item.setOrdersId(orderId);
            orderItemMapper.insert(item);  // 또는 orderItemMapper.insert(item);
        }

        log.info("✅ KakaoPay ready: PENDING 주문 및 주문 아이템 insert 완료, tid={}, orderId={}", tid, orderId);

        Map<String, Object> result = new HashMap<>();
        result.put("next_redirect_pc_url", body.get("next_redirect_pc_url"));
        result.put("tid", tid);
        result.put("orderId", orderId);

        return result;
    }

    @Transactional
    public void approve(PaymentApproveRequest request) {
        OrderDto order = orderMapper.findLatestPendingByAccountId(request.getAccountId());
        if (order == null) {
            throw new IllegalArgumentException("PENDING 상태의 주문이 없습니다.");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "KakaoAK " + adminKey);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("tid", order.getTid());
        params.add("partner_order_id", String.valueOf(request.getAccountId()));
        params.add("partner_user_id", request.getAccountId().toString());
        params.add("pg_token", request.getPgToken());

        HttpEntity<MultiValueMap<String, String>> httpRequest = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://kapi.kakao.com/v1/payment/approve",
                httpRequest,
                Map.class
        );

        log.info("✅ KakaoPay Approve Response: {}", response.getBody());

        orderService.updatePaymentStatus(order.getId(), "PAID");

        log.info("✅ 주문 결제 완료 및 재고 차감 완료: Order ID={}, User ID={}", order.getId(), request.getAccountId());
        cartService.clearCartByAccountId(order.getAccountId()); // ✅ 결제 완료 후 장바구니 비우기

        if (order.getAmount() != null && order.getAmount() > 0) {
            userPointService.usePoint(order.getAccountId(), order.getAmount());
            pointLogService.saveLog(order.getAccountId(), "USE", order.getAmount());
            log.info("✅ 포인트 사용 완료: {}P, User ID={}", order.getAmount(), order.getAccountId());
        }

        int savePoint = userPointService.updateUserPointAndGrade(order.getAccountId(), order.getPayAmount());
        pointLogService.saveLog(order.getAccountId(), "SAVE", savePoint);
        log.info("✅ 포인트 적립 완료: {}P, User ID={}", savePoint, order.getAccountId());
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

        log.info("✅ KakaoPay Cancel Response: {}", response.getBody());

        orderMapper.updateStatus(order.getId(), "CANCELLED");

        int refundPoint = userPointService.deductPointByOrder(order.getAccountId(), order.getPayAmount());
        pointLogService.saveLog(order.getAccountId(), "REFUND_DEDUCT", refundPoint);
        log.info("✅ 포인트 회수 완료: {}P, User ID: {}", refundPoint, order.getAccountId());

        if (order.getAmount() != null && order.getAmount() > 0) {
            userPointService.restorePoint(order.getAccountId(), order.getAmount());
            pointLogService.saveLog(order.getAccountId(), "REFUND_RESTORE", order.getAmount());
            log.info("✅ 사용 포인트 복원 완료: {}P, User ID: {}", order.getAmount(), order.getAccountId());
        }
    }
}
