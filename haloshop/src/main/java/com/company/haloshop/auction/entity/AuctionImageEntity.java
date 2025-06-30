package com.company.haloshop.auction.entity;

import lombok.*;
import javax.persistence.*;

@Entity
@Table(name = "auction_image")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auction_id", nullable = false)
    private AuctionEntity auction;

    @Column(length = 255, nullable = false)
    private String url;
}
