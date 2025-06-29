package com.company.haloshop.entity.member;

import lombok.*;
import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "user_status")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString(exclude = "accounts")
public class UserStatus {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "status")
    private Integer status;

    // 1:N Accounts
    @OneToMany(mappedBy = "userStatus", fetch = FetchType.LAZY)
    private List<Account> accounts;
}
