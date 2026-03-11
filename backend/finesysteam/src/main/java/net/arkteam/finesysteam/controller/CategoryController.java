package net.arkteam.finesysteam.controller;

import net.arkteam.finesysteam.entity.Category;
import net.arkteam.finesysteam.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        Category created = categoryService.createCategory(category);
        return ResponseEntity.created(URI.create("/categories/" + created.getId())).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable String id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String parentCategoryId) {

        List<Category> categories;
        if (name != null) {
            categories = categoryService.getCategoriesByName(name);
        } else if (parentCategoryId != null) {
            categories = categoryService.getCategoriesByParent(parentCategoryId);
        } else {
            categories = categoryService.getAllCategories();
        }
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable String id, @RequestBody Category category) {
        category.setId(id);
        Category updated = categoryService.updateCategory(category);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
