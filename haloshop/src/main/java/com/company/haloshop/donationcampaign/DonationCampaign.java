package com.company.haloshop.donationcampaign;

import javax.persistence.*;

import com.company.haloshop.season.Season;
import com.company.haloshop.team.Team;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "donation_campaign")
@Getter
@Setter
@NoArgsConstructor
public class DonationCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private Long total = 0L;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Builder
    public DonationCampaign(String image, Long total, Season season, Team team) {
        this.total = total;
        this.season = season;
        this.team = team;
    }
}
