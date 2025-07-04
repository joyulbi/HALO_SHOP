package com.company.haloshop.cart;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.shop.Cart;
import com.company.haloshop.security.JwtTokenProvider;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
    private final JwtTokenProvider jwtTokenProvider;

    // 장바구니 담기
    @PostMapping
    public void addCart(@RequestBody Cart cart, HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);
        Long accountId = jwtTokenProvider.getAccountId(token); // ✅ 토큰에서 유저 ID 추출
        cart.setAccountId(accountId); // 로그인 유저 ID 강제 세팅

        cartService.addCart(cart);
    }

    // 장바구니 목록 조회
    @GetMapping
    public ResponseEntity<List<Cart>> getCartList(HttpServletRequest request) {
        String token = jwtTokenProvider.resolveToken(request);
        Long accountId = jwtTokenProvider.getAccountId(token); // ✅ 토큰에서 유저 ID 추출

        List<Cart> cartList = cartService.getCartList(accountId);
        return ResponseEntity.ok(cartList);
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
