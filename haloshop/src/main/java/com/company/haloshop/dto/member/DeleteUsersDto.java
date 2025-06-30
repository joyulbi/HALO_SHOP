package com.company.haloshop.dto.member;

import lombok.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class DeleteUsersDto {
    private Long accountId;
    private Date deletedAt;
}
