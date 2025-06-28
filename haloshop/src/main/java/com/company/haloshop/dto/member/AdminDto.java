package com.company.haloshop.dto.member;

import lombok.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class AdminDto {
    private Long accountId;
    private Integer role;
    private Boolean lock;
    private Long assignedBy;
    private Date updatedAt;
    private String lastIp;
}
