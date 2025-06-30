package com.company.haloshop.campaignimage;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignImageDto {

    private Long seasonId;
    private String level_1;
    private String level_2;
    private String level_3;

}