package com.company.haloshop.item;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.shop.Item;

import java.util.List;

@Controller
@RequestMapping("/admin/item")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;

    // 상품 목록 (JSP 화면)
    @GetMapping("/list")
    public String list(Model model) {
        List<Item> items = itemService.findAll();
        model.addAttribute("items", items);
        return "item/list";
    }

    // 상품 상세 (JSP 화면)
    @GetMapping("/detail/{id}")
    public String detail(@PathVariable Long id, Model model) {
        Item item = itemService.findById(id);
        model.addAttribute("item", item);
        return "item/detail";
    }

    // 상품 등록
    @PostMapping("/add")
    public String add(Item item) {
        itemService.insert(item);
        return "redirect:/admin/item/list";
    }

    // 상품 수정
    @PostMapping("/update")
    public String update(Item item) {
        itemService.update(item);
        return "redirect:/admin/item/list";
    }

    // 상품 삭제
    @PostMapping("/delete")
    public String delete(@RequestParam Long id) {
        itemService.delete(id);
        return "redirect:/admin/item/list";
    }
}
