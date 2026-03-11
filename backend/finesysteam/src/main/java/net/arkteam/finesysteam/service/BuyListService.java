package net.arkteam.finesysteam.service;


import net.arkteam.finesysteam.entity.BuyList;
import net.arkteam.finesysteam.repository.BuyListRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BuyListService {

    private final BuyListRepository repository;

    public BuyListService(BuyListRepository repository) {
        this.repository = repository;
    }

    public BuyList create(BuyList buyList) {
        return repository.save(buyList);
    }

    public Optional<BuyList> getById(String id) {
        return repository.findById(id);
    }

    public List<BuyList> getAll() {
        return repository.findAll();
    }

    public List<BuyList> getByPurchasedStatus(boolean purchased) {
        return repository.findByPurchased(purchased);
    }

    public BuyList update(BuyList buyList) {
        return repository.save(buyList);
    }

    public void deleteById(String id) {
        repository.deleteById(id);
    }


    public void clearPurchasedItems() {
        repository.deleteByPurchased(true);
    }

    public void clearAll() {
        repository.deleteAll();
    }
}