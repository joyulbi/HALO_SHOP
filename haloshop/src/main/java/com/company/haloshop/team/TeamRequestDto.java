package com.company.haloshop.team;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class TeamRequestDto {
	@NotBlank
    private String name;
    private Boolean active;
}