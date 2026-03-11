package net.arkteam.finesysteam.controller;

import net.arkteam.finesysteam.entity.BuyList;
import net.arkteam.finesysteam.entity.Stock;
import net.arkteam.finesysteam.service.BuyListService;
import net.arkteam.finesysteam.repository.StockRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/buylist")
@CrossOrigin(origins = "http://localhost:3000")
public class BuyListController {

    private final BuyListService buyListService;
    private final StockRepository stockRepository;

    public BuyListController(BuyListService buyListService, StockRepository stockRepository) {
        this.buyListService = buyListService;
        this.stockRepository = stockRepository;
    }

    @PostMapping
    public ResponseEntity<BuyList> createBuyItem(@RequestBody BuyList item) {
        BuyList created = buyListService.create(item);
        return ResponseEntity.created(URI.create("/api/buylist/" + created.getId())).body(created);
    }

    @GetMapping
    public List<BuyList> getAll() {
        return buyListService.getAll();
    }

    @PutMapping
    public ResponseEntity<BuyList> update(@RequestBody BuyList update) {
        BuyList saved = buyListService.update(update);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        buyListService.deleteById(id);
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping("/clear/purchased")
    public ResponseEntity<Void> clearPurchased() {
        buyListService.clearPurchasedItems();
        return ResponseEntity.noContent().build();
    }

    // DTO
    public static class BuyListRequest {
        private String stockItemId;
        private double quantity;
        private String unit;
        private String reason;
        public String getStockItemId() { return stockItemId; }
        public void setStockItemId(String stockItemId) { this.stockItemId = stockItemId; }
        public double getQuantity() { return quantity; }
        public void setQuantity(double quantity) { this.quantity = quantity; }
        public String getUnit() { return unit; }
        public void setUnit(String unit) { this.unit = unit; }
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
}
