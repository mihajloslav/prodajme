package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rs.ac.bg.fon.prodajme.entity.Category;
import rs.ac.bg.fon.prodajme.entity.Product;
import rs.ac.bg.fon.prodajme.entity.ProductImage;
import rs.ac.bg.fon.prodajme.entity.User;
import rs.ac.bg.fon.prodajme.exception.ResourceNotFoundException;
import rs.ac.bg.fon.prodajme.repository.CategoryRepository;
import rs.ac.bg.fon.prodajme.repository.FavoriteRepository;
import rs.ac.bg.fon.prodajme.repository.MessageRepository;
import rs.ac.bg.fon.prodajme.repository.ProductRepository;
import rs.ac.bg.fon.prodajme.repository.PurchaseRepository;
import rs.ac.bg.fon.prodajme.repository.ReviewRepository;
import rs.ac.bg.fon.prodajme.repository.UserRepository;
import rs.ac.bg.fon.prodajme.service.ProductService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final MessageRepository messageRepository;
    private final FavoriteRepository favoriteRepository;
    private final PurchaseRepository purchaseRepository;
    private final ReviewRepository reviewRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              UserRepository userRepository,
                              CategoryRepository categoryRepository,
                              MessageRepository messageRepository,
                              FavoriteRepository favoriteRepository,
                              PurchaseRepository purchaseRepository,
                              ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.messageRepository = messageRepository;
        this.favoriteRepository = favoriteRepository;
        this.purchaseRepository = purchaseRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Override
    public Product findById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
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
            throw new ResourceNotFoundException("User not found");
        }

        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new ResourceNotFoundException("Category not found");
        }

        return create(product, product.getUser().getId(), product.getCategory().getId());
    }

    @Override
    public Product create(Product product, Integer userId, Integer categoryId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (product.getDatePosted() == null) {
            product.setDatePosted(LocalDateTime.now());
        }

        product.setUser(user);
        product.setCategory(category);

        if (product.getImages() != null) {
            for (ProductImage image : product.getImages()) {
                image.setProduct(product);
            }
        }

        return productRepository.save(product);
    }

    @Override
    public Product update(Integer id, Product product) {
        if (product.getUser() == null || product.getUser().getId() == null) {
            throw new ResourceNotFoundException("User not found");
        }

        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new ResourceNotFoundException("Category not found");
        }

        return update(id, product, product.getUser().getId(), product.getCategory().getId());
    }

    @Override
    public Product update(Integer id, Product product, Integer userId, Integer categoryId) {
        Product existingProduct = findById(id);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        existingProduct.setTitle(product.getTitle());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setDatePosted(product.getDatePosted());
        existingProduct.setStatus(product.getStatus());
        existingProduct.setUser(user);
        existingProduct.setCategory(category);

        existingProduct.getImages().clear();
        if (product.getImages() != null) {
            for (ProductImage image : product.getImages()) {
                image.setProduct(existingProduct);
                existingProduct.getImages().add(image);
            }
        }

        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }

        // Delete dependent rows first to satisfy FK constraints when removing product.
        messageRepository.deleteByProductId(id);
        favoriteRepository.deleteByProductId(id);
        purchaseRepository.deleteByProductId(id);
        reviewRepository.deleteByProductId(id);

        productRepository.deleteById(id);
    }
}
