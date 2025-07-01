package com.company.haloshop.campaignimage;

import javax.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignImageRequestDto {

    @NotNull(message = "시즌 ID는 필수입니다.")
    private Long seasonId;

    private String level_1;
    private String level_2;
    private String level_3;

}