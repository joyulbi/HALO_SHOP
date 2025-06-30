package com.company.haloshop.orderitem;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.company.haloshop.entity.delivery.DeliveryTracking;
import com.company.haloshop.entity.review.Review;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ordersId;
    private Long itemId;
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
