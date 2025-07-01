package com.company.haloshop.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.company.haloshop.dto.shop.Cart;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartMapper cartMapper;

    public void addCart(Cart cart) {
        cartMapper.insertCart(cart);
    }

    public List<Cart> getCartList(Long accountId) {
        return cartMapper.getCartList(accountId);
    }

    public void updateCart(Cart cart) {
        cartMapper.updateCart(cart);
    }

    public void deleteCart(Long id) {
        cartMapper.deleteCart(id);
    }
}
