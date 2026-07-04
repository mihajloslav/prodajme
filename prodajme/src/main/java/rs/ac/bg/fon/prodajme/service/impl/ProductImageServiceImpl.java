package rs.ac.bg.fon.prodajme.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.entity.Product;
import rs.ac.bg.fon.prodajme.entity.ProductImage;
import rs.ac.bg.fon.prodajme.exception.BadRequestException;
import rs.ac.bg.fon.prodajme.exception.ResourceNotFoundException;
import rs.ac.bg.fon.prodajme.repository.ProductImageRepository;
import rs.ac.bg.fon.prodajme.repository.ProductRepository;
import rs.ac.bg.fon.prodajme.service.ProductImageService;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;

@Service
public class ProductImageServiceImpl implements ProductImageService {

    private static final Logger log = LoggerFactory.getLogger(ProductImageServiceImpl.class);
    private static final String PRODUCT_UPLOAD_URL_PREFIX = "/uploads/products/";

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;
    private final String uploadDir;

    public ProductImageServiceImpl(ProductImageRepository productImageRepository,
                                   ProductRepository productRepository,
                                   @Value("${app.upload.dir}") String uploadDir) {
        this.productImageRepository = productImageRepository;
        this.productRepository = productRepository;
        this.uploadDir = uploadDir;
    }

    @Override
    public List<ProductImage> findByProductId(Integer productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }
        return productImageRepository.findByProductId(productId)
                .stream()
                .sorted(Comparator.comparing(ProductImage::getId, Comparator.nullsLast(Integer::compareTo)))
                .toList();
    }

    @Override
    public ProductImage addImage(Integer productId, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        long imageCount = productImageRepository.findByProductId(productId).size();
        if (imageCount >= 10) {
            throw new BadRequestException("Product can have maximum 10 images");
        }

        ProductImage image = new ProductImage();
        image.setImageUrl(imageUrl);
        image.setProduct(product);

        return productImageRepository.save(image);
    }

    @Override
    public void deleteImage(Integer imageId) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Product image not found"));

        deleteFileIfUploaded(image.getImageUrl());
        productImageRepository.delete(image);
    }

    private void deleteFileIfUploaded(String imageUrl) {
        if (imageUrl == null || !imageUrl.startsWith(PRODUCT_UPLOAD_URL_PREFIX)) {
            return;
        }

        String fileName = imageUrl.substring(PRODUCT_UPLOAD_URL_PREFIX.length());
        Path filePath = Paths.get(uploadDir).resolve(fileName);

        try {
            boolean deleted = Files.deleteIfExists(filePath);
            if (!deleted) {
                log.warn("Product image file not found on disk: {}", filePath);
            }
        } catch (Exception ex) {
            log.warn("Failed to delete product image file {}: {}", filePath, ex.getMessage());
        }
    }
}
