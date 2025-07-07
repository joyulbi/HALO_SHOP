// src/main/java/com/company/haloshop/dto/member/LogsDto.java
package com.company.haloshop.dto.member;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class LogsDto {
    private Long   id;
    private Long   accountId;
    private Long   targetAccountId;
    private String action;
    private String description;
    private String ip;
}
