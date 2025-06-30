package com.company.haloshop.season;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class SeasonDto {
    private Long id;
    private String name;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long level_1;
    private Long level_2;
    private Long level_3;
    private LocalDateTime createdAt;

}
