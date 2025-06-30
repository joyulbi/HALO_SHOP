package com.company.haloshop.donationhistory;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/donation-histories")
@RequiredArgsConstructor
public class DonationHistoryController {

    private final DonationHistoryService donationHistoryService;

    // 기부내역 등록
    @PostMapping
    public ResponseEntity<Void> createDonationHistory(@RequestBody DonationHistory donationHistory) {
        donationHistoryService.createDonationHistory(donationHistory);
        return ResponseEntity.ok().build();
    }

    // 단일 기부내역 조회
    @GetMapping("/{id}")
    public ResponseEntity<DonationHistory> getDonationHistoryById(@PathVariable Long id) {
        DonationHistory donationHistory = donationHistoryService.getDonationHistoryById(id);
        if (donationHistory == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(donationHistory);
    }

    // 전체 기부내역 조회
    @GetMapping
    public ResponseEntity<List<DonationHistory>> getAllDonationHistories() {
        List<DonationHistory> list = donationHistoryService.getAllDonationHistories();
        return ResponseEntity.ok(list);
    }

    // 기부내역 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateDonationHistory(@PathVariable Long id, @RequestBody DonationHistory donationHistory) {
        donationHistory.setId(id);
        donationHistoryService.updateDonationHistory(donationHistory);
        return ResponseEntity.ok().build();
    }

    // 기부내역 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonationHistory(@PathVariable Long id) {
        donationHistoryService.deleteDonationHistoryById(id);
        return ResponseEntity.ok().build();
    }
}
