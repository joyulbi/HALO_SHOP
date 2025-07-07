package com.company.haloshop.donationhistory;

import java.util.List;

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
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationHistoryController {

    private final DonationHistoryService donationHistoryService;

    @PostMapping("/{accountId}")
    public ResponseEntity<String> donate(
        @PathVariable Long accountId,
        @RequestBody DonationHistoryRequestDto request
    ) {
        donationHistoryService.donate(accountId, request.getCampaignId(), request.getAmount());
        return ResponseEntity.ok("기부가 성공적으로 처리되었습니다.");
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
