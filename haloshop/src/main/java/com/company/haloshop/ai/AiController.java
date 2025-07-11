package com.company.haloshop.ai;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AiController {

    private final OpenAiService openAiService;

    public AiController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @GetMapping("/api/ai-suggest")
    public String getAiSuggestion(@RequestParam String name) {
        return openAiService.getAiSuggestion(name);
    }
    
    @GetMapping("/api/ai-image-alt")
    public ResponseEntity<String> getImageAlt(@RequestParam String filename, @RequestParam String name, @RequestParam String team) {
        String prompt = String.format("상품명: %s, 팀: %s, 파일명: %s 이미지를 설명하는 SEO 최적화 alt 태그를 작성해줘. 간결하고 핵심을 설명하는 문장으로.", name, team, filename);
        String aiResult = openAiService.getAiSuggestion(prompt);
        return ResponseEntity.ok(aiResult);
    }
    
    // 리뷰 감성 분석을 위한 새로운 API 엔드포인트 추가
    @PostMapping("/api/items/{id}/sentiment")
    public ResponseEntity<Object> analyzeReviewSentiment(@RequestBody String review) {
        System.out.println("Received review: " + review);
    	
    	// 리뷰에 대한 감성 분석을 위한 프롬프트 생성
        String prompt = "다음 리뷰에 대해 긍정적인 반응과 부정적인 반응의 비율을 분석해줘: " + review;
        
        // OpenAI 서비스 호출하여 감성 분석 결과 얻기
        String aiResult = openAiService.getAiSuggestion(prompt);

        // 감성 분석 결과에서 긍정적/부정적 비율을 추출
        Sentiment sentiment = extractSentimentFromResult(aiResult);

        // 감성 분석 결과를 구조화하여 반환
        return ResponseEntity.ok(sentiment);  // Sentiment는 구조화된 DTO입니다.
    }
    
    // 감성 분석 결과를 위한 DTO 클래스 예시
    public static class Sentiment {
        private int positivePercentage;
        private int negativePercentage;

        public Sentiment(int positivePercentage, int negativePercentage) {
            this.positivePercentage = positivePercentage;
            this.negativePercentage = negativePercentage;
        }

        public int getPositivePercentage() {
            return positivePercentage;
        }

        public void setPositivePercentage(int positivePercentage) {
            this.positivePercentage = positivePercentage;
        }

        public int getNegativePercentage() {
            return negativePercentage;
        }

        public void setNegativePercentage(int negativePercentage) {
            this.negativePercentage = negativePercentage;
        }
    }

    // 감성 분석 결과에서 긍정적/부정적 비율을 추출하는 메서드
    private Sentiment extractSentimentFromResult(String aiResult) {
        // 예시: "이 제품은 84% 긍정적인 반응을 얻었어요!"
        Pattern positivePattern = Pattern.compile("(\\d+)% 긍정적인");
        Pattern negativePattern = Pattern.compile("(\\d+)% 부정적인");

        Matcher positiveMatcher = positivePattern.matcher(aiResult);
        Matcher negativeMatcher = negativePattern.matcher(aiResult);

        int positivePercentage = 0;
        int negativePercentage = 0;

        if (positiveMatcher.find()) {
            positivePercentage = Integer.parseInt(positiveMatcher.group(1));
        }
        if (negativeMatcher.find()) {
            negativePercentage = Integer.parseInt(negativeMatcher.group(1));
        }

        // 부정적인 반응 비율은 나머지 비율로 설정 (100%에서 긍정적 비율을 뺀 값)
        if (positivePercentage + negativePercentage < 100) {
            negativePercentage = 100 - positivePercentage;
        }

        return new Sentiment(positivePercentage, negativePercentage);
    }
}
