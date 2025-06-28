package com.company.haloshop.entity.security;

import lombok.*;
import javax.persistence.*;
import java.util.Date;

import com.company.haloshop.entity.member.Account;

@Entity
@Table(name = "jwt_whitelist")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString(exclude = "account")
public class JwtWhitelist {

    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "refresh_token", length = 512)
    private String refreshToken;

    @Column(name = "issued_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date issuedAt;

    @Column(name = "expires_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiresAt;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "last_used_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastUsedAt;

    @Column(name = "is_active")
    private Boolean isActive;
}
