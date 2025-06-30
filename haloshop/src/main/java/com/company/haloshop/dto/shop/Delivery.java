package com.company.haloshop.dto.shop;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Delivery {
    private Long id;
    private Long accountId;
    private String address;
    private String addressDetail;
    private Integer zipcode;
    private String recipientName;
}
