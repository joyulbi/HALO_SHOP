package com.company.haloshop.dto.member;

import lombok.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DeletedUsersBackupDto {
    private Long accountId;
    private String email;
    private String password;
    private Boolean emailChk;
    private String nickname;
    private Boolean isAdmin;
    private Date lastActive;
    private String ip;
    private String phone;
    private Date passwordUpdatedAt;
    private Date createdAt;
    private Integer userStatusId;
    private Date updatedAt;
    private Integer socialType;
}
