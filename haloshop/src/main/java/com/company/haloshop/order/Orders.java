package com.company.haloshop.order;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accountId;
    private Long deliveryId;
    private Long totalPrice;
    private String used;            // 결제 수단
    private String paymentStatus;   // PENDING, PAID, FAILED
    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private Timestamp createdAt;

    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private Timestamp updatedAt;
}
