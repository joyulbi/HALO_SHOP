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

    @Column(name = "items_id", nullable = false)
    private Long itemsId;

    @Column(nullable = false)
    private String url;
}
