package com.company.haloshop.donate;

import javax.persistence.*;

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

    private String image;

    private Long total;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "season_id", nullable = false)
    private Season season;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @Builder
    public DonationCampaign(String image, Long total, Season season, Team team) {
        this.image = image;
        this.total = total;
        this.season = season;
        this.team = team;
    }
}
