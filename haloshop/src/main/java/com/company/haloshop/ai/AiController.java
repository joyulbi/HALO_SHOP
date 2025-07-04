package com.company.haloshop.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
}
