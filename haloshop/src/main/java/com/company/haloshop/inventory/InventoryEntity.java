package com.company.haloshop.inventory;

import lombok.*;
import javax.persistence.*;

import com.company.haloshop.items.ItemsEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "items_id", nullable = false)
    private ItemsEntity item;

    @Column(name = "stock_volume", nullable = false)
    private int stockVolume;

    @Column(name = "inventory_volume", nullable = false)
    private int inventoryVolume;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
