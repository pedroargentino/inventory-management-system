package net.arkteam.finesysteam.repository;

import net.arkteam.finesysteam.entity.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByName(String name);
    List<Category> findByParentCategoryId(String parentCategoryId);
}
