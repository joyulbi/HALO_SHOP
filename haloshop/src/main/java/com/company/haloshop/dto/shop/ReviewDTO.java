package com.company.haloshop.dto.shop;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
public class ReviewDTO {
	
    private Long id;
    private Long orderItemsId;
    private Long accountId;
    private String content;
    private Integer rating;
    private LocalDateTime createdAt;
    
    @JsonIgnore
    private List<String> images;
    
    private String authorName;
    private String productName;
}
