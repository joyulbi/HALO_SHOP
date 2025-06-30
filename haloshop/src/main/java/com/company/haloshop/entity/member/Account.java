package com.company.haloshop.entity.member;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.company.haloshop.entity.delivery.Delivery;
import com.company.haloshop.entity.review.Review;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "account")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString(exclude = {"userStatus", "social", "user", "admin", "logs"})
public class Account {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;


    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password", nullable = false, length = 512)
    private String password;

    @Column(name = "email_chk")
    private Boolean emailChk;

    @Column(name = "nickname", length = 255)
    private String nickname;

    @Column(name = "is_admin")
    private Boolean isAdmin;

    @Column(name = "last_active")
    @Temporal(TemporalType.DATE)
    private Date lastActive;

    @Column(name = "ip", length = 50)
    private String ip;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "password_updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date passwordUpdatedAt;

    @Column(name = "created_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "updated_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedAt;


    // 다대1 UserStatus
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_status_id")
    private UserStatus userStatus;

    // 다대1 Social
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "social_id")
    private Social social;

    // 1:1 User (mappedBy = "account")
    @OneToOne(mappedBy = "account", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private User user;

    // 1:1 Admin (mappedBy = "account")
    @OneToOne(mappedBy = "account", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Admin admin;

    // 1:N Logs (account 주체)
    @OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
    private List<Logs> logs;

    // 1:N Logs (account 대상)
    @OneToMany(mappedBy = "targetAccount", fetch = FetchType.LAZY)
    private List<Logs> targetLogs;
    
    // 1:N Delivery (mappedBy="account")
    @OneToMany(mappedBy = "account")
    private List<Delivery> deliveries;
    
    // 1:N Review (mappedBy="account")
    @OneToMany(mappedBy = "account")
    private List<Review> reviews;
}
