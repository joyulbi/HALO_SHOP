package com.company.haloshop.dto.security;

import lombok.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class JwtWhitelistDto {
    private Long id;
    private Long accountId;
    private String refreshToken;
    private Date issuedAt;
    private Date expiresAt;
    private Date createdAt;
    private Date lastUsedAt;
    private Boolean isActive;
}
