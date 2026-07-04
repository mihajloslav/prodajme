package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.entity.Product;
import rs.ac.bg.fon.prodajme.entity.ProductImage;
import rs.ac.bg.fon.prodajme.exception.ResourceNotFoundException;
import rs.ac.bg.fon.prodajme.repository.ProductImageRepository;
import rs.ac.bg.fon.prodajme.repository.ProductRepository;
import rs.ac.bg.fon.prodajme.service.ProductImageService;

import java.util.List;

@Service
public class ProductImageServiceImpl implements ProductImageService {

    private final ProductImageRepository productImageRepository;
    private final ProductRepository productRepository;

    public ProductImageServiceImpl(ProductImageRepository productImageRepository,
                                   ProductRepository productRepository) {
        this.productImageRepository = productImageRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductImage> findByProductId(Integer productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found");
        }
        return productImageRepository.findByProductId(productId);
    }

    @Override
    public ProductImage addImage(Integer productId, String imageUrl) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        ProductImage image = new ProductImage();
        image.setImageUrl(imageUrl);
        image.setProduct(product);

        return productImageRepository.save(image);
    }

    @Override
    public void deleteImage(Integer imageId) {
        ProductImage image = productImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Product image not found"));
        productImageRepository.delete(image);
    }
}
