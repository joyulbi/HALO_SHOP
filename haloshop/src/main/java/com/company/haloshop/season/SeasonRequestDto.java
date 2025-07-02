package com.company.haloshop.season;

import java.time.LocalDateTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeasonRequestDto {

	@NotBlank private String name;
	@NotNull private LocalDateTime startDate;
	@NotNull private LocalDateTime endDate;
	@PositiveOrZero private Long level_1;
	@PositiveOrZero private Long level_2;
	@PositiveOrZero private Long level_3;
}
