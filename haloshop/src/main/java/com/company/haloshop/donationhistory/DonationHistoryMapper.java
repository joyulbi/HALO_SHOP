package com.company.haloshop.donationhistory;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface DonationHistoryMapper {

    // 기부내역 등록
    void insertDonationHistory(DonationHistory donationHistory);

    // ID로 기부내역 조회
    DonationHistory selectDonationHistoryById(Long id);

    // 모든 기부내역 조회
    List<DonationHistory> selectAllDonationHistories();

    // ID로 기부내역 삭제
    void deleteDonationHistoryById(Long id);

    // 수정
    void updateDonationHistory(DonationHistory donationHistory);
    
    // 조회용 시즌별로 조회
    List<DonationHistory> selectByAccountIdWithSeasonCampaign(
    	    @Param("seasonId") Long seasonId,
    	    @Param("accountId") Long accountId
    	);
}
