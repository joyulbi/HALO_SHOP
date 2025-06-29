package com.company.haloshop.entity.member;

import lombok.*;
import javax.persistence.*;

@Entity
@Table(name = "logs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString(exclude = {"account", "targetAccount"})
public class Logs {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "target_account_id")
    private Account targetAccount;

    @Column(name = "action", length = 50)
    private String action;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "ip", length = 50)
    private String ip;
}
