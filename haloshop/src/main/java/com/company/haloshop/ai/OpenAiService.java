package com.company.haloshop.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class OpenAiService {

    @Value("${openai.api-key}")
    private String openAiApiKey;

    public String getAiSuggestion(String prompt) {
        String apiUrl = "https://api.openai.com/v1/chat/completions";

        RestTemplate restTemplate = new RestTemplate();

        // 요청 Body 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o"); // ✅ 최신 버전으로 변경

        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> userMessage = new HashMap<>();

        // ✅ 프롬프트 강화
        String fullPrompt = "상품명: " + prompt + "에 대해 사람들이 클릭하고 싶어질 만한 자극적이고 임팩트 있는 " +
                "쇼핑몰 상품명을 한 줄로 추천해줘. 키워드는 간결하게, 제목은 실제로 구매를 유도할 수 있도록 " +
                "강력하게 작성해.";

        userMessage.put("role", "user");
        userMessage.put("content", fullPrompt);
        messages.add(userMessage);
        requestBody.put("messages", messages);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

        return message.get("content").toString().trim();
    }
    
    // 리뷰 감성 분석을 위한 메서드 추가
    public String analyzeSentiment(String review) {
        String apiUrl = "https://api.openai.com/v1/chat/completions";
        
        RestTemplate restTemplate = new RestTemplate();
        
        // 요청 Body 생성
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o");  // 최신 모델 사용
        
        Map<String, String> userMessage = new HashMap<>();
        
        // 감성 분석을 위한 프롬프트
        String fullPrompt = "다음 리뷰에 대해 긍정적인 반응과 부정적인 반응의 비율을 분석해줘: " + review;
        
        userMessage.put("role", "user");
        userMessage.put("content", fullPrompt);
        
        requestBody.put("messages", List.of(userMessage));  // List 대신 하나의 메시지만 담기

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        try {
            // API 호출
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, entity, Map.class);
            
            // 응답 값 처리
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    return message.get("content").toString().trim();
                } else {
                    throw new RuntimeException("No choices returned from OpenAI API.");
                }
            } else {
                throw new RuntimeException("Error calling OpenAI API: " + response.getStatusCode());
            }
        } catch (Exception e) {
            // 예외 처리
            throw new RuntimeException("Failed to analyze sentiment: " + e.getMessage(), e);
        }
    }

}
