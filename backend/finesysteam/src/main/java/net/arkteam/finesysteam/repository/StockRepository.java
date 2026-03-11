package net.arkteam.finesysteam.repository;


import net.arkteam.finesysteam.entity.Category;
import net.arkteam.finesysteam.entity.Stock;
import net.arkteam.finesysteam.entity.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface StockRepository extends MongoRepository<Stock, String> {
    List<Stock> findByItemName(String itemName);
    List<Stock> findByCategory(Category categoryId);
    List<Stock> findByLocation(String locationId);
    List<Stock> findByLocation(Location location);

}