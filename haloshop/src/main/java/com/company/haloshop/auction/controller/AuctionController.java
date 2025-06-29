package com.company.haloshop.auction.controller;

import com.company.haloshop.auction.dto.Auction;
import com.company.haloshop.auction.service.AuctionService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/auctions")
public class AuctionController {
    private final AuctionService auctionService;

    public AuctionController(AuctionService auctionService) {
        this.auctionService = auctionService;
    }

    @GetMapping("/{id}")
    public Auction getById(@PathVariable Long id) {
        return auctionService.getById(id);
    }

    @GetMapping
    public List<Auction> getAll() {
        return auctionService.getAll();
    }

    @PostMapping
    public void create(@RequestBody Auction auction) {
        auctionService.create(auction);
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody Auction auction) {
        auction.setId(id);
        auctionService.update(auction);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        auctionService.delete(id);
    }
}
