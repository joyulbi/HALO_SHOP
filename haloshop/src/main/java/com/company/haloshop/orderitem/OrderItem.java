package com.company.haloshop.orderitem;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;



import com.company.haloshop.entity.delivery.DeliveryTracking;
import com.company.haloshop.entity.review.Review;
import com.company.haloshop.items.ItemsEntity;
import com.company.haloshop.order.Orders;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "order_items")
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orders_id", nullable = false)
    private Orders orders;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private ItemsEntity item;
    
    private String itemName;
    private Integer productPrice;
    private Integer quantity;
    
    // 1:1 (mappedBy = "orderItem")
    @OneToOne(mappedBy = "orderItem")
    private Review review;
    
    // 1:1 (mappedBy = "orderItem")
    @OneToOne(mappedBy = "orderItem")
    private DeliveryTracking deliveryTracking;
}
