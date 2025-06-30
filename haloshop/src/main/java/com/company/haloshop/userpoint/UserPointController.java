package com.company.haloshop.userpoint;

import com.company.haloshop.dto.shop.UserPointDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/userpoint")
@RequiredArgsConstructor
public class UserPointController {

    private final UserPointService userPointService;

    @GetMapping
    public ResponseEntity<List<UserPointDto>> findAll() {
        return ResponseEntity.ok(userPointService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserPointDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(userPointService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Void> insert(@RequestBody UserPointDto userPoint) {
        userPointService.insert(userPoint);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody UserPointDto userPoint) {
        userPoint.setId(id);
        userPointService.update(userPoint);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userPointService.delete(id);
        return ResponseEntity.ok().build();
    }
}
