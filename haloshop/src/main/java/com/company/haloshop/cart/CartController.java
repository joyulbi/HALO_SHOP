package com.company.haloshop.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.shop.Cart;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    // 장바구니 담기
    @PostMapping
    public void addCart(@RequestBody Cart cart) {
        cartService.addCart(cart);
    }

    // 장바구니 목록 조회
    @GetMapping("/{accountId}")
    public List<Cart> getCartList(@PathVariable Long accountId) {
        return cartService.getCartList(accountId);
    }

    // 장바구니 수량 수정
    @PutMapping("/{id}")
    public void updateCart(@PathVariable Long id, @RequestBody Cart cart) {
        cart.setId(id);
        cartService.updateCart(cart);
    }

    // 장바구니 삭제
    @DeleteMapping("/{id}")
    public void deleteCart(@PathVariable Long id) {
        cartService.deleteCart(id);
    }
}
