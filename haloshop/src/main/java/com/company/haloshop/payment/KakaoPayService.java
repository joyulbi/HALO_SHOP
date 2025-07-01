package com.company.haloshop.payment;

import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.order.OrderMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/pay/kakao")
@RequiredArgsConstructor
@Slf4j
public class KakaoPayService {

    private final OrderMapper orderMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${kakao.pay.admin-key}")
    private String adminKey;

    @Value("${kakao.pay.cid}")
    private String cid;

    @PostMapping("/ready/{orderId}")
    public ResponseEntity<Map<String, Object>> ready(@PathVariable Long orderId) {
        OrderDto order = orderMapper.findById(orderId);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "KakaoAK " + adminKey);
        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", cid);
        params.add("partner_order_id", orderId.toString());
        params.add("partner_user_id", order.getAccountId().toString());
        params.add("item_name", "HaloShop 결제");
        params.add("quantity", "1");
        params.add("total_amount", order.getTotalPrice().toString());
        params.add("tax_free_amount", "0");
        params.add("approval_url", "http://localhost:8080/api/pay/kakao/success?orderId=" + orderId);
        params.add("cancel_url", "http://localhost:8080/api/pay/kakao/cancel");
        params.add("fail_url", "http://localhost:8080/api/pay/kakao/fail");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://kapi.kakao.com/v1/payment/ready",
                request,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        log.info("KakaoPay Ready Response: {}", body);

        order.setTid(body.get("tid").toString());
        orderMapper.updateTid(order.getId(), order.getTid());

        Map<String, Object> result = new HashMap<>();
        result.put("next_redirect_pc_url", body.get("next_redirect_pc_url"));

        return ResponseEntity.ok(result);
    }
}
