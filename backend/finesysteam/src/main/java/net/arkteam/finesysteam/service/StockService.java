package net.arkteam.finesysteam.service;

import jakarta.validation.Valid;
import net.arkteam.finesysteam.entity.Stock;
import net.arkteam.finesysteam.repository.StockRepository;
import net.arkteam.finesysteam.entity.Location;
import net.arkteam.finesysteam.entity.Category;
import net.arkteam.finesysteam.repository.LocationRepository;
import net.arkteam.finesysteam.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Optional;

@Service
@Validated
public class StockService {

    private final StockRepository stockRepository;
    private final LocationRepository locationRepository;
    private final CategoryRepository categoryRepository;

    public StockService(StockRepository stockRepository,
                        LocationRepository locationRepository,
                        CategoryRepository categoryRepository) {
        this.stockRepository = stockRepository;
        this.locationRepository = locationRepository;
        this.categoryRepository = categoryRepository;
    }

    public Stock create(@Valid Stock stock) {
        // Ensure referenced entities exist
        Location loc = locationRepository.findById(stock.getLocation().getId())
                .orElseThrow(() -> new IllegalArgumentException("Location not found: " + stock.getLocation().getId()));
        Category cat = categoryRepository.findById(stock.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + stock.getCategory().getId()));

        stock.setLocation(loc);
        stock.setCategory(cat);
        return stockRepository.save(stock);
    }

    public Optional<Stock> findById(String id) {
        return stockRepository.findById(id);
    }

    public List<Stock> findAll() {
        return stockRepository.findAll();
    }

    public List<Stock> findByItemName(String itemName) {
        return stockRepository.findByItemName(itemName);
    }

    public List<Stock> findByCategory(String categoryId) {
        Category cat = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + categoryId));
        return stockRepository.findByCategory(cat);
    }

    public List<Stock> findByLocation(String locationId) {
        Location loc = locationRepository.findById(locationId)
                .orElseThrow(() -> new IllegalArgumentException("Location not found: " + locationId));
        return stockRepository.findByLocation(loc);
    }

    public Stock update(String id, @Valid Stock stock) {
        Stock existing = stockRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stock not found: " + id));

        existing.setItemName(stock.getItemName());
        existing.setQuantity(stock.getQuantity());
        existing.setUnit(stock.getUnit());
        existing.setExpirationDate(stock.getExpirationDate());
        existing.setMinimumStock(stock.getMinimumStock());

        Location loc = locationRepository.findById(stock.getLocation().getId())
                .orElseThrow(() -> new IllegalArgumentException("Location not found: " + stock.getLocation().getId()));
        Category cat = categoryRepository.findById(stock.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found: " + stock.getCategory().getId()));

        existing.setLocation(loc);
        existing.setCategory(cat);

        return stockRepository.save(existing);
    }

    public void delete(String id) {
        if (!stockRepository.existsById(id)) {
            throw new IllegalArgumentException("Stock not found: " + id);
        }
        stockRepository.deleteById(id);
    }
}
