package net.arkteam.finesysteam.repository;

import net.arkteam.finesysteam.entity.BuyList;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BuyListRepository extends MongoRepository<BuyList, String> {

    List<BuyList> findByPurchased(boolean purchased);

    void deleteByPurchased(boolean purchased);

    void deleteAll();
}
