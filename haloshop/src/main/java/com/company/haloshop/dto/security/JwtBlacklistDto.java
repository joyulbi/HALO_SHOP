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
    private Date issuedAt;
    private Date expiresAt;
    private Date blacklistedAt;
    private String reason;
    private Boolean ban;
}
