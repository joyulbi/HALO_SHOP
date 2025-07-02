package com.company.haloshop.auction.entity;

import lombok.*;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "auction")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer startPrice;

    @Column(nullable = false)
    private LocalDateTime startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private AuctionStatus status = AuctionStatus.READY;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AuctionImageEntity> images;

    @OneToMany(mappedBy = "auction", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AuctionLogEntity> logs;

    @OneToOne(mappedBy = "auction", cascade = CascadeType.ALL, orphanRemoval = true)
    private AuctionResultEntity result;

    public enum AuctionStatus {
        READY, ONGOING, FINISHED, CANCELED
    }
    
    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
