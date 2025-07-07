package com.company.haloshop.payment;

import com.company.haloshop.payment.dto.PaymentApproveRequest;
import com.company.haloshop.payment.dto.PaymentReadyRequest; // ✅ 추가
import com.company.haloshop.payment.dto.PaymentCancelRequest; // ✅ 추가
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {

    private final KakaoPayService kakaoPayService;
    private final CardPayService cardPayService;

    @PostMapping("/mock/approve")
    public ResponseEntity<?> approveMockPayment(@RequestParam Long orderId) {
    	log.info("✅ [Mock 결제 승인 요청] orderId={}", orderId);  // ✅ 이 줄 추가
    	cardPayService.approve(orderId);
        return ResponseEntity.ok().build();
    }

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
    public ResponseEntity<?> cancelPayment(@RequestBody PaymentCancelRequest request) { // ✅ 수정
        kakaoPayService.cancel(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/approve-success")
    public void kakaoApproveSuccess(
            @RequestParam("pg_token") String pgToken,
            @RequestParam(value = "accountId", required = false, defaultValue = "1") Long accountId,
            HttpServletResponse response
    ) throws IOException {
        log.info("KakaoPay approve-success 호출: pg_token={}, accountId={}", pgToken, accountId);

        PaymentApproveRequest request = new PaymentApproveRequest();
        request.setPgToken(pgToken);
        request.setAccountId(accountId);

        kakaoPayService.approve(request);

        response.sendRedirect("http://localhost:3000/payment/success?success=true");
    }
    
    @PostMapping("/mock/cancel")
    public ResponseEntity<?> cancelMockPayment(@RequestParam Long orderId) {
        cardPayService.cancel(orderId);
        return ResponseEntity.ok().build();
    }

}
