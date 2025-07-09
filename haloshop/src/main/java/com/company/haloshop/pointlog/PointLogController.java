package com.company.haloshop.pointlog;

import com.company.haloshop.dto.shop.PointLogDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/pointlog")
@RequiredArgsConstructor
public class PointLogController {

    private final PointLogService pointLogService;
    @GetMapping
    public ResponseEntity<List<PointLogDto>> findAll() {
        return ResponseEntity.ok(pointLogService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PointLogDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(pointLogService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Void> insert(@RequestBody PointLogDto pointLogDto) {
        pointLogService.insert(pointLogDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody PointLogDto pointLogDto) {
        pointLogDto.setId(id);
        pointLogService.update(pointLogDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pointLogService.delete(id);
        return ResponseEntity.ok().build();
    }
}
