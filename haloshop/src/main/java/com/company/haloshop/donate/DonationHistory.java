package com.company.haloshop.donate;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "donation_history")
@Data
public class DonationHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campaign_id", nullable = false)
    private DonationCampaign campaign;

    //@ManyToOne(fetch = FetchType.LAZY)
   // @JoinColumn(name = "point_log_id", nullable = false)
    //private PointLog pointLog;

    private Long amount;

    private LocalDateTime createdAt = LocalDateTime.now();
}

