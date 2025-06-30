package com.company.haloshop.dto.shop;

import lombok.Data;
import java.util.List;

@Data
public class ItemRequest {
    private Items item;
    private List<String> imageUrls;
}
