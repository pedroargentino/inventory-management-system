package net.arkteam.finesysteam.service;

import net.arkteam.finesysteam.entity.Category;
import net.arkteam.finesysteam.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Optional<Category> getCategoryById(String id) {
        return categoryRepository.findById(id);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getCategoriesByName(String name) {
        return categoryRepository.findByName(name);
    }

    public List<Category> getCategoriesByParent(String parentCategoryId) {
        return categoryRepository.findByParentCategoryId(parentCategoryId);
    }

    public Category updateCategory(Category category) {
        return categoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        categoryRepository.deleteById(id);
    }
}

