package com.company.haloshop.membership;

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
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private int price;
    @Column(name = "price_point")
    private int pricePoint;
}
   
/*
 INSERT INTO membership (name, price, price_point) VALUES
('브론즈', 0, 0),
('실버', 100000, 1000),
('골드', 300000, 3000),
('플래티넘', 500000, 5000);
 
 */