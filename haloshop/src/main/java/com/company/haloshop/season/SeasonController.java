package com.company.haloshop.season;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/seasons")
@RequiredArgsConstructor
public class SeasonController {

    private final SeasonService seasonService;

    // 전체 시즌 조회
    @GetMapping
    public ResponseEntity<List<Season>> getAllSeasons() {
        List<Season> seasons = seasonService.findAllSeason();
        return ResponseEntity.ok(seasons);
    }

    // 단일 시즌 조회
    @GetMapping("/{id}")
    public ResponseEntity<Season> getSeasonById(@PathVariable Long id) {
        Season season = seasonService.findById(id);
        if (season == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(season);
    }

    // 시즌 생성
    @PostMapping
    public ResponseEntity<Map<String, Object>> createSeason(@RequestBody Season season) {
        int result = seasonService.insertSeason(season);
        if (result == 1) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "새 시즌이 정상적으로 생성되었습니다");
            response.put("season", season);  // 필요 시 생성된 데이터 포함 가능
            return ResponseEntity.ok(response);
        }
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", "시즌을 생성하는데 문제가 발생했습니다");
        return ResponseEntity.status(500).body(errorResponse);
    }

    // 시즌 수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updateSeason(@PathVariable Long id, @RequestBody Season season) {
        season.setId(id);
        int result = seasonService.updateSeason(season);
        if (result == 1) {
            return ResponseEntity.ok("Season updated successfully.");
        }
        return ResponseEntity.status(500).body("Failed to update season.");
    }

    // 시즌 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSeason(@PathVariable Long id) {
        int result = seasonService.deleteSeason(id);
        if (result == 1) {
            return ResponseEntity.ok("Season deleted successfully.");
        }
        return ResponseEntity.status(500).body("Failed to delete season.");
    }
}
