package com.company.haloshop.entity.member;

import lombok.*;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "social")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString(exclude = "accounts")
public class Social {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "social_type", length = 20)
    private String socialType;

    // 1:N Accounts
    @OneToMany(mappedBy = "social", fetch = FetchType.LAZY)
    private List<Account> accounts;
}
