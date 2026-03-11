package net.arkteam.finesysteam.repository;

import net.arkteam.finesysteam.entity.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LocationRepository extends MongoRepository<Location, String> {
    List<Location> findByStockName(String stockName);
    List<Location> findByLocation(String location);
}