package rs.ac.bg.fon.prodajme.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rs.ac.bg.fon.prodajme.dto.CategoryDto;
import rs.ac.bg.fon.prodajme.mapper.CategoryMapper;
import rs.ac.bg.fon.prodajme.response.ApiResponse;
import rs.ac.bg.fon.prodajme.response.ApiResponseFactory;
import rs.ac.bg.fon.prodajme.service.CategoryService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllCategories() {
        List<CategoryDto> categories = categoryService.findAll()
                .stream()
                .map(CategoryMapper::toDto)
                .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Kategorije su uspešno učitane", Map.of("categories", categories)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCategoryById(@PathVariable Integer id) {
        CategoryDto category = CategoryMapper.toDto(categoryService.findById(id));
        return ResponseEntity.ok(ApiResponseFactory.success("Kategorija je uspešno učitana", Map.of("category", category)));
    }
}
