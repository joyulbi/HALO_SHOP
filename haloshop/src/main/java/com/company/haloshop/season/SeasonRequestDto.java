package com.company.haloshop.season;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeasonRequestDto {

    private String name;

    private LocalDateTime startDate;

    private LocalDateTime endDate;

    private Long level_1;
    private Long level_2;
    private Long level_3;
}
