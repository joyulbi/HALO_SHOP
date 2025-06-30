package com.company.haloshop.entity.member;

import lombok.*;
import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "deleted_users_backup")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @ToString(exclude = "userStatus")
public class DeletedUsersBackup {

    @Id
    @Column(name = "account_id")
    private Long accountId;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "password", length = 512)
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
    @Temporal(TemporalType.DATE)
    private Date passwordUpdatedAt;

    @Column(name = "createdAt")
    @Temporal(TemporalType.DATE)
    private Date createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_status_id")
    private UserStatus userStatus;

    @Column(name = "updatedAt")
    @Temporal(TemporalType.DATE)
    private Date updatedAt;

    @Column(name = "social_type")
    private Integer socialType;
}
