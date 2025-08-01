package com.company.haloshop.order;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.company.haloshop.delivery.DeliveryTrackingMapper;
import com.company.haloshop.dto.shop.DeliveryTrackingDTO;
import com.company.haloshop.dto.shop.Items;
import com.company.haloshop.dto.shop.OrderDto;
import com.company.haloshop.dto.shop.OrderItemDto;
import com.company.haloshop.dto.shop.OrderRequestDto;
import com.company.haloshop.inventory.InventoryService;
import com.company.haloshop.items.ItemsMapper;
import com.company.haloshop.orderitem.OrderItemMapper;
import com.company.haloshop.pointlog.PointLogService;
import com.company.haloshop.userpoint.UserPointService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final UserPointService userPointService;
    private final PointLogService pointLogService;
    private final ItemsMapper itemsMapper;
    private final InventoryService inventoryService;
    private final DeliveryTrackingMapper deliveryTrackingMapper;


    public List<OrderDto> findAll() {
        return orderMapper.findAll();
    }
    public List<OrderDto> findByAccountId(Long accountId) {
        return orderMapper.findByAccountId(accountId);
    }


    public OrderDto findById(Long id) {
        OrderDto order = orderMapper.findById(id);
        List<OrderItemDto> items = orderItemMapper.findByOrderId(id);
        order.setOrderItems(items);
        return order;
    }

    public void insert(OrderDto orderDto) {
        orderMapper.insert(orderDto);
    }

    public void update(OrderDto orderDto) {
        orderMapper.update(orderDto);
    }

    @Transactional
    public void delete(Long id, Long accountId) {
        OrderDto order = orderMapper.findById(id);
        if (order == null) {
            throw new IllegalArgumentException("주문이 존재하지 않습니다.");
        }
        if (!order.getAccountId().equals(accountId)) {
            throw new SecurityException("본인 주문만 삭제할 수 있습니다.");
        }
        if ("PAID".equals(order.getPaymentStatus())) {
            throw new IllegalStateException("이미 결제 완료된 주문은 삭제할 수 없습니다.");
        }
        orderMapper.delete(id);
    }



    @Transactional
    public Long insertOrderWithItems(OrderRequestDto orderRequestDto) {

        // ✅ 1) payAmount 계산 (결제금액 = 총 주문금액 - 사용포인트)
        long payAmount = orderRequestDto.getTotalPrice() -
                (orderRequestDto.getAmount() != null ? orderRequestDto.getAmount() : 0);
        orderRequestDto.setPayAmount(payAmount);

        // ✅ 2) 주문 INSERT
        orderMapper.insertOrderWithItems(orderRequestDto);
        Long orderId = orderRequestDto.getId();

        // ✅ 3) 주문 아이템 INSERT
        List<OrderItemDto> orderItems = orderRequestDto.getOrderItems();
        if (orderItems == null || orderItems.isEmpty()) {
            throw new IllegalArgumentException("주문 아이템이 없습니다.");
        }
        for (OrderItemDto itemDto : orderItems) {
            itemDto.setOrdersId(orderId);
            orderItemMapper.insert(itemDto);
        }

        Long accountId = orderRequestDto.getAccountId();

         //✅ 4) 포인트 사용 처리 및 사용 로그 기록
        if (orderRequestDto.getAmount() != null && orderRequestDto.getAmount() > 0) {
            userPointService.usePoint(accountId, orderRequestDto.getAmount());
           // pointLogService.saveLog(accountId, "USE", orderRequestDto.getAmount());
        }

        // ✅ 5) 포인트 적립 및 멤버십 갱신 (결제금액(payAmount) 기준으로 적립)
       // int savePoint = userPointService.updateUserPointAndGrade(accountId, payAmount);

        // ✅ 6) 적립 포인트 로그 기록
        //if (savePoint > 0) {
            //pointLogService.saveLog(accountId, "SAVE", savePoint);
       // }
        return orderId;
    }
    
    // 주문 상태 변경 (결제 완료 후 배송 추적 삽입)
    @Transactional
    public void updatePaymentStatus(Long orderId, String paymentStatus) {
        orderMapper.updateStatus(orderId, paymentStatus);
        System.out.println("🚩 결제 상태 업데이트 완료: orderId=" + orderId + ", status=" + paymentStatus);

        if ("PAID".equals(paymentStatus)) {
            List<OrderItemDto> orderItems = orderItemMapper.findByOrderId(orderId);
            System.out.println("🚩 주문 아이템 수: " + orderItems.size());

            // 🚩🚩🚩 [여기] 로그 넣기
            for (OrderItemDto item : orderItems) {
                log.info("✅ [검증] orderId={}, itemId={}, itemName={}, quantity={}",
                    orderId, item.getItemId(), item.getItemName(), item.getQuantity());
            }

            // 재고 확인 및 차감
            for (OrderItemDto item : orderItems) {
                boolean isEnough = inventoryService.checkInventoryEnough(item.getItemId(), item.getQuantity());
                if (!isEnough) {
                    throw new IllegalStateException("재고가 부족하여 결제를 완료할 수 없습니다. itemId=" + item.getItemId());
                }
            }

            for (OrderItemDto item : orderItems) {
                System.out.println("🚩 재고 차감 시도: itemId=" + item.getItemId() + ", quantity=" + item.getQuantity());
                inventoryService.decreaseInventory(item.getItemId(), item.getQuantity());
            }

            // ✅ 배송 추적 정보 삽입 (주문 상태가 PAID일 때)
            Map<String, String> carrierCodeMap = Map.of(
                "CJ대한통운", "C",
                "한진택배", "H",
                "롯데택배", "R",
                "우체국택배", "U"
            );
            List<String> carriers = new ArrayList<>(carrierCodeMap.keySet());

            for (OrderItemDto item : orderItems) {
                DeliveryTrackingDTO trackingDTO = new DeliveryTrackingDTO();
                trackingDTO.setOrderItemsId(item.getId()); // `order_item_id`로 배송 추적 정보 삽입
                trackingDTO.setStatus("배송준비중");

                // 🚩 랜덤 배송사 선택
                String carrier = carriers.get(ThreadLocalRandom.current().nextInt(carriers.size()));
                trackingDTO.setCarrier(carrier);

                // 🚩 택배사 코드 앞자리 + 9자리 랜덤 숫자
                String code = carrierCodeMap.get(carrier);
                String trackingNumber = code + ThreadLocalRandom.current().nextInt(100_000_000, 1_000_000_000);
                trackingDTO.setTrackingNumber(trackingNumber);

                trackingDTO.setUpdatedAt(LocalDateTime.now());

                // 배송 추적 정보 삽입
                deliveryTrackingMapper.insertTracking(trackingDTO);
            }
        }
    }
    
    public List<Items> getRecentPurchasedItems(Long accountId, int limit) {
        List<OrderDto> orders = orderMapper.findRecentPaidOrders(accountId, 10); // 최근 10건 주문
        List<Items> result = new ArrayList<>();
        Set<Long> seenItemIds = new HashSet<>();

        for (OrderDto order : orders) {
            List<OrderItemDto> orderItems = orderItemMapper.findByOrderId(order.getId());
            for (OrderItemDto item : orderItems) {
                if (seenItemIds.contains(item.getItemId())) continue;

                Items fullItem = itemsMapper.findById(item.getItemId());
                if (fullItem != null) {
                    result.add(fullItem);
                    seenItemIds.add(fullItem.getId());
                }
                if (result.size() >= limit) return result;
            }
        }

        return result;
    }


}