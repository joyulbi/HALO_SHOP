package com.company.haloshop.category;

import com.company.haloshop.items.ItemsEntity;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    // 🔥 ItemsEntity와의 연관관계
    @OneToMany(mappedBy = "category")
    private List<ItemsEntity> items = new ArrayList<>();
}
