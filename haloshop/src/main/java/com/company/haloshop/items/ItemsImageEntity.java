package com.company.haloshop.items;

import lombok.*;

import javax.persistence.*;

@Entity
@Table(name = "items_image")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemsImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "items_id", nullable = false)
    private ItemsEntity item;

    @Column(nullable = false)
    private String url;
}
