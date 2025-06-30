package com.company.haloshop.dto.shop;

import java.time.LocalDateTime;

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
public class ReviewImageDTO {
    private Long id;
    private Long reviewId;
    private String url;
    private LocalDateTime uploadedAt;
}
