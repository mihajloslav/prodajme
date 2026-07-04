package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.entity.Category;
import rs.ac.bg.fon.prodajme.exception.ResourceNotFoundException;
import rs.ac.bg.fon.prodajme.repository.CategoryRepository;
import rs.ac.bg.fon.prodajme.service.CategoryService;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    @Override
    public Category findById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }
}
