package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rs.ac.bg.fon.prodajme.entity.Category;
import rs.ac.bg.fon.prodajme.entity.Product;
import rs.ac.bg.fon.prodajme.entity.ProductImage;
import rs.ac.bg.fon.prodajme.entity.User;
import rs.ac.bg.fon.prodajme.enums.ProductStatus;
import rs.ac.bg.fon.prodajme.exception.ResourceNotFoundException;
import rs.ac.bg.fon.prodajme.repository.CategoryRepository;
import rs.ac.bg.fon.prodajme.repository.FavoriteRepository;
import rs.ac.bg.fon.prodajme.repository.ProductRepository;
import rs.ac.bg.fon.prodajme.repository.UserRepository;
import rs.ac.bg.fon.prodajme.service.ProductService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private static final ProductStatus STATUS_DELETED = ProductStatus.DELETED;

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FavoriteRepository favoriteRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              UserRepository userRepository,
                              CategoryRepository categoryRepository,
                              FavoriteRepository favoriteRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findByStatusNot(STATUS_DELETED);
    }

    @Override
    public Product findById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proizvod nije pronađen."));

        if (product.getStatus() == STATUS_DELETED) {
            throw new ResourceNotFoundException("Proizvod više nije dostupan.");
        }

        return product;
    }

    @Override
    public List<Product> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            return List.of();
        }

        ProductStatus parsedStatus;
        try {
            parsedStatus = ProductStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return List.of();
        }

        if (parsedStatus == STATUS_DELETED) {
            return List.of();
        }

        return productRepository.findByStatus(parsedStatus);
    }

    @Override
    public List<Product> searchByTitle(String title) {
        return productRepository.findByTitleContainingIgnoreCaseAndStatusNot(title, STATUS_DELETED);
    }

    @Override
    public Product create(Product product) {
        if (product.getUser() == null || product.getUser().getId() == null) {
            throw new ResourceNotFoundException("Korisnik nije pronađen.");
        }

        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new ResourceNotFoundException("Kategorija nije pronađena.");
        }

        return create(product, product.getUser().getId(), product.getCategory().getId());
    }

    @Override
    public Product create(Product product, Integer userId, Integer categoryId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen."));

        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Kategorija nije pronađena."));

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
            throw new ResourceNotFoundException("Korisnik nije pronađen.");
        }

        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new ResourceNotFoundException("Kategorija nije pronađena.");
        }

        return update(id, product, product.getUser().getId(), product.getCategory().getId());
    }

    @Override
    public Product update(Integer id, Product product, Integer userId, Integer categoryId) {
        Product existingProduct = findById(id);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen."));
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Kategorija nije pronađena."));

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
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proizvod nije pronađen."));

        product.setStatus(STATUS_DELETED);
        productRepository.save(product);
        favoriteRepository.deleteByProductId(id);
    }
}
