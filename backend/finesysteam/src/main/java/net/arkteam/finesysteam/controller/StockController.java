package net.arkteam.finesysteam.controller;

import jakarta.validation.Valid;
import net.arkteam.finesysteam.entity.Stock;
import net.arkteam.finesysteam.service.StockService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stocks")
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping
    public ResponseEntity<Stock> createStock(@Valid @RequestBody Stock stock) {
        Stock created = stockService.create(stock);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable String id) {
        return stockService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks(
            @RequestParam(required = false) String itemName,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) String locationId) {

        List<Stock> stocks;
        if (itemName != null) {
            stocks = stockService.findByItemName(itemName);
        } else if (categoryId != null) {
            stocks = stockService.findByCategory(categoryId);
        } else if (locationId != null) {
            stocks = stockService.findByLocation(locationId);
        } else {
            stocks = stockService.findAll();
        }
        return ResponseEntity.ok(stocks);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stock> updateStock(
            @PathVariable String id,
            @Valid @RequestBody Stock stock) {
        Stock updated = stockService.update(id, stock);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable String id) {
        stockService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
