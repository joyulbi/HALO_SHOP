package com.company.haloshop.auction.entity;

import lombok.*;
import javax.persistence.*;
import java.time.LocalDateTime;
import com.company.haloshop.entity.member.Account;

@Entity
@Table(name = "auction_result")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionResultEntity {
    @Id
    @JoinColumn(name = "auction_id")
    private Long auctionId; // PK, FK

    @MapsId
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id")
    private AuctionEntity auction;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Column(nullable = false)
    private Integer finalPrice;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private Boolean confirmed;

    private LocalDateTime confirmedAt;

    @Column(columnDefinition = "TEXT")
    private String canceledReason;

    @Column(columnDefinition = "TEXT")
    private String adminMemo;

    private Boolean reRegistered = false;
}
