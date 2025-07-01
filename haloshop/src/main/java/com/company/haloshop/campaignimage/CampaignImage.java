package com.company.haloshop.campaignimage;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.company.haloshop.season.Season;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "campaign_image")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignImage {

    @Id
    @Column(name = "season_id")
    private Long seasonId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "season_id")
    private Season season;

    private String level_1;

    private String level_2;

    private String level_3;

}