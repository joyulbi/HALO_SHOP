package com.company.haloshop.entity.member;

import lombok.*;
import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "admin")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString(exclude = {"account", "assignedBy"})
public class Admin {

    @Id
    @Column(name = "account_id")
    private Long accountId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "role")
    private Integer role;

    @Column(name = "is_locked")
    private Boolean locked;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_by")
    private Admin assignedBy;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;

    @Column(name = "last_ip", length = 50)
    private String lastIp;
}
