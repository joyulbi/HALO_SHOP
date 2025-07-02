package com.company.haloshop.orderitem;

import com.company.haloshop.dto.shop.OrderItemDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
@RequiredArgsConstructor
public class OrderItemController {

    private final OrderItemService orderItemService;

    @GetMapping
    public ResponseEntity<List<OrderItemDto>> findAll() {
        return ResponseEntity.ok(orderItemService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItemDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(orderItemService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Void> insert(@RequestBody OrderItemDto orderItemDto) {
        orderItemService.insert(orderItemDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @RequestBody OrderItemDto orderItemDto) {
        orderItemDto.setId(id);
        orderItemService.update(orderItemDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        orderItemService.delete(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<OrderItemDto>> findByCategoryId(@PathVariable Long categoryId) {
        return ResponseEntity.ok(orderItemService.findAllByCategoryId(categoryId));
    }

}
