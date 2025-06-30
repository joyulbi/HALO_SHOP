package com.company.haloshop.season;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<String> createSeason(@RequestBody Season season) {
        int result = seasonService.insertSeason(season);
        if (result == 1) {
            return ResponseEntity.ok("Season created successfully.");
        }
        return ResponseEntity.status(500).body("Failed to create season.");
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
