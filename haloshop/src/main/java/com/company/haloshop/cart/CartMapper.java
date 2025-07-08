package com.company.haloshop.cart;

import org.apache.ibatis.annotations.Mapper;

import com.company.haloshop.dto.shop.Cart;

import java.util.List;

@Mapper
public interface CartMapper {
    void insertCart(Cart cart);
    List<Cart> getCartList(Long accountId);
    void updateCart(Cart cart);
    void deleteCart(Long id);
    Cart findCartItem(Long accountId, Long itemsId);
    void deleteAllByAccountId(Long accountId);

}
