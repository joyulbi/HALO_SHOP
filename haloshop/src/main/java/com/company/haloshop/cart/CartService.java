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
        // 중복 상품 조회
        Cart existingCart = cartMapper.findCartItem(cart.getAccountId(), cart.getItemsId());

        if (existingCart != null) {
            // 있으면 수량만 증가
            existingCart.setQuantity(existingCart.getQuantity() + cart.getQuantity());
            cartMapper.updateCart(existingCart);
        } else {
            // 없으면 새로 추가
            cartMapper.insertCart(cart);
        }
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
    public void clearCartByAccountId(Long accountId) {
        cartMapper.deleteAllByAccountId(accountId);
    }

}
