package com.company.haloshop.order;

import com.company.haloshop.entity.delivery.Delivery;
import com.company.haloshop.entity.member.Account;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    private Long totalPrice;

    private String used;            // 결제 수단

    private String paymentStatus;   // PENDING, PAID, FAILED

    private Integer amount;         // 포인트 사용 금액

    private Long payAmount;

    @Column(length = 50)
    private String tid; // 카카오페이 거래 고유 번호

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
