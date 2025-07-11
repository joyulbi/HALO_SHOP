package com.company.haloshop.ai;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.Items;
import com.company.haloshop.items.ItemsMapper;
import com.company.haloshop.order.OrderService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GptRecommendService {

    private final OrderService orderService;
    private final ItemsMapper itemsMapper;

    public List<Items> getRecommendedItems(Long accountId) {
        List<Items> recentItems = orderService.getRecentPurchasedItems(accountId, 3);

        // 최근 구매한 카테고리 ID들 추출
        Set<Long> categoryIds = recentItems.stream()
                .map(Items::getCategoryId)
                .collect(Collectors.toSet());

        // 최근 본 상품 ID들 (중복 추천 방지용)
        Set<Long> purchasedItemIds = recentItems.stream()
                .map(Items::getId)
                .collect(Collectors.toSet());

        // 추천 상품 목록
        List<Items> recommended = new ArrayList<>();

        for (Long categoryId : categoryIds) {
            List<Items> byCategory = itemsMapper.findByCategoryId(categoryId);
            for (Items item : byCategory) {
                if (!purchasedItemIds.contains(item.getId())) {
                    recommended.add(item);
                }
                if (recommended.size() >= 5) break; // 최대 5개까지 추천
            }
            if (recommended.size() >= 5) break;
        }

        return recommended;
    }
}
