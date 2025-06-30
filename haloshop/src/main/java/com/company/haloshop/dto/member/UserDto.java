package com.company.haloshop.dto.member;

import lombok.*;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDto {
    private Long accountId;
    private String address;
    private String addressDetail;
    private Integer zipcode;
    private Date birth;
    private String gender;
}
