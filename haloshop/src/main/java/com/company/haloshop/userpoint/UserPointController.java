package com.company.haloshop.userpoint;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.company.haloshop.dto.shop.UserPointDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/userpoint")
@RequiredArgsConstructor
public class UserPointController {

    private final UserPointService userPointService;

    // 관리자용 전체 조회
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserPointDto>> findAll() {
        return ResponseEntity.ok(userPointService.findAll());
    }

    // 회원별 단일 조회
    @GetMapping("/{accountId}")
    public ResponseEntity<UserPointDto> findByAccountId(@PathVariable Long accountId) {
        UserPointDto userPoint = userPointService.findByAccountId(accountId);
        if (userPoint == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userPoint);
    }

    // 수동 생성 (필요 시)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> insert(@RequestBody UserPointDto userPoint) {
        userPointService.insert(userPoint);
        return ResponseEntity.ok().build();
    }

    // 수동 수정 (관리자 조정 용도)
    @PutMapping("/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> update(@PathVariable Long accountId, @RequestBody UserPointDto userPoint) {
        userPoint.setAccountId(accountId);
        userPointService.update(userPoint);
        return ResponseEntity.ok().build();
    }

    // 회원 탈퇴 시 연동 삭제
    @DeleteMapping("/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long accountId) {
        userPointService.deleteByAccountId(accountId);
        return ResponseEntity.ok().build();
    }

    // 주문 후 포인트 적립 및 등급 갱신 엔드포인트 (테스트용)
    @PostMapping("/{accountId}/update-grade")
    public ResponseEntity<Void> updateUserPointAndGrade(
            @PathVariable Long accountId,
            @RequestParam Long totalPrice) {
        userPointService.updateUserPointAndGrade(accountId, totalPrice);
        return ResponseEntity.ok().build();
    }

    // ✅ 관리자 수동 포인트 조정 엔드포인트 추가
    @PostMapping("/{accountId}/adjust")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adjustPointManually(
            @PathVariable Long accountId,
            @RequestParam int adjustAmount,
            @RequestParam String adjustType) {

    	userPointService.adjustPointManually(accountId, adjustAmount);
        return ResponseEntity.ok().build();
    }
    
 // ✅ 특정 유저의 등급/누적 결제금액 확인
    @GetMapping("/admin/{accountId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserPointDto> getUserPointAdmin(@PathVariable Long accountId) {
        UserPointDto userPoint = userPointService.findByAccountId(accountId);
        if (userPoint == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userPoint);
    }

    // ✅ 특정 유저의 등급 수동 수정
    @PutMapping("/admin/{accountId}/grade")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserGradeAdmin(
            @PathVariable Long accountId,
            @RequestParam String grade
    ) {
        userPointService.updateUserGrade(accountId, grade);
        return ResponseEntity.ok().build();
    }

}
