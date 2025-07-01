package com.company.haloshop.season;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.*;

import com.company.haloshop.donationcampaign.DonationCampaign;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "season")
@Getter
@Setter
@NoArgsConstructor
public class Season {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    private Long level_1;
    private Long level_2;
    private Long level_3;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "season", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonationCampaign> campaigns = new ArrayList<>();

    @Builder
    public Season(String name, LocalDateTime startDate, LocalDateTime endDate, Long level_1, Long level_2, Long level_3) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.level_1 = level_1;
        this.level_2 = level_2;
        this.level_3 = level_3;
        this.createdAt = LocalDateTime.now();
    }
}
