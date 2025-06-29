package com.company.haloshop.items;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.company.haloshop.dto.shop.Items;

import java.util.List;

@Controller
@RequestMapping("/admin/item")
@RequiredArgsConstructor
public class ItemsController {

    private final ItemsService itemsService;

    // 상품 목록 (JSP 화면)
    @GetMapping("/list")
    public String list(Model model) {
        List<Items> items = itemsService.findAll();
        model.addAttribute("items", items);
        return "item/list";
    }

    // 상품 상세 (JSP 화면)
    @GetMapping("/detail/{id}")
    public String detail(@PathVariable Long id, Model model) {
        Items item = itemsService.findById(id);
        model.addAttribute("item", item);
        return "item/detail";
    }

    // 상품 등록
    @PostMapping("/add")
    public String add(Items item) {
        itemsService.insert(item);
        return "redirect:/admin/item/list";
    }

    // 상품 수정
    @PostMapping("/update")
    public String update(Items item) {
        itemsService.update(item);
        return "redirect:/admin/item/list";
    }

    // 상품 삭제
    @PostMapping("/delete")
    public String delete(@RequestParam Long id) {
        itemsService.delete(id);
        return "redirect:/admin/item/list";
    }
}
