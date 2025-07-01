package com.company.haloshop.dto.security;

import lombok.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class JwtBlacklistDto {
    private Long id;
    private Long accountId;
    private String refreshToken;
    private String accessToken;    // 새로 추가
    private Date issuedAt;
    private Date expiresAt;
    private Date blacklistedAt;
    private String reason;
}
