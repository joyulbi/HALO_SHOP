package com.company.haloshop.ai;

import com.company.haloshop.dto.shop.Items;
import com.company.haloshop.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recommend")
public class GptController {

    private final GptRecommendService gptRecommendService;
    private final JwtTokenProvider jwtTokenProvider;

    // ✅ 카테고리 기반 추천 API (최근 구매 상품 기준)
    @GetMapping("/gpt")
    public ResponseEntity<?> getGptRecommendation(HttpServletRequest request) {
        try {
            String token = jwtTokenProvider.resolveToken(request);
            Long accountId = jwtTokenProvider.getAccountId(token);

            List<Items> recommendedItems = gptRecommendService.getRecommendedItems(accountId);
            return ResponseEntity.ok(recommendedItems);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("추천 실패: " + e.getMessage());
        }
    }
}
