package com.company.haloshop.dto.shop;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MembershipDto {
    private Integer id;
    private String name;
    private Integer price;
    private Integer pricePoint;
}
/*import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Membership {
	private Integer id;
	private String name;
	private Integer price;
	private Integer pricePoint;
}*/
