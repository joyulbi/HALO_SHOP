package com.company.haloshop.payment;

import com.company.haloshop.payment.dto.PaymentApproveRequest;
import com.company.haloshop.payment.dto.PaymentCancelRequest;
import com.company.haloshop.payment.dto.PaymentReadyRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final KakaoPayService kakaoPayService;

    @PostMapping("/ready")
    public ResponseEntity<?> readyPayment(@RequestBody PaymentReadyRequest request) {
        return ResponseEntity.ok(kakaoPayService.ready(request));
    }

    @PostMapping("/approve")
    public ResponseEntity<?> approvePayment(@RequestBody PaymentApproveRequest request) {
        kakaoPayService.approve(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/cancel")
    public ResponseEntity<?> cancelPayment(@RequestBody PaymentCancelRequest request) {
        kakaoPayService.cancel(request);
        return ResponseEntity.ok().build();
    }
}