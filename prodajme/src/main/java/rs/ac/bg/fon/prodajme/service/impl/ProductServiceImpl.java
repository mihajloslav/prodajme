package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.entity.Category;
import rs.ac.bg.fon.prodajme.entity.Product;
import rs.ac.bg.fon.prodajme.entity.User;
import rs.ac.bg.fon.prodajme.repository.CategoryRepository;
import rs.ac.bg.fon.prodajme.repository.ProductRepository;
import rs.ac.bg.fon.prodajme.repository.UserRepository;
import rs.ac.bg.fon.prodajme.service.ProductService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              UserRepository userRepository,
                              CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Product findById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    @Override
    public List<Product> findByStatus(String status) {
        return productRepository.findByStatus(status);
    }

    @Override
    public List<Product> searchByTitle(String title) {
        return productRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public Product create(Product product) {
        if (product.getUser() == null || product.getUser().getId() == null) {
            throw new RuntimeException("User not found");
        }

        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new RuntimeException("Category not found");
        }

        return create(product, product.getUser().getId(), product.getCategory().getId());
    }

    @Override
    public Product create(Product product, Integer userId, Integer categoryId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        if (product.getDatePosted() == null) {
            product.setDatePosted(LocalDateTime.now());
        }

        product.setUser(user);
        product.setCategory(category);
        return productRepository.save(product);
    }

    @Override
    public Product update(Integer id, Product product) {
        if (product.getUser() == null || product.getUser().getId() == null) {
            throw new RuntimeException("User not found");
        }

        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new RuntimeException("Category not found");
        }

        return update(id, product, product.getUser().getId(), product.getCategory().getId());
    }

    @Override
    public Product update(Integer id, Product product, Integer userId, Integer categoryId) {
        Product existingProduct = findById(id);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        existingProduct.setTitle(product.getTitle());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setImageUrl(product.getImageUrl());
        existingProduct.setDatePosted(product.getDatePosted());
        existingProduct.setStatus(product.getStatus());
        existingProduct.setUser(user);
        existingProduct.setCategory(category);
        return productRepository.save(existingProduct);
    }

    @Override
    public void delete(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }
}
