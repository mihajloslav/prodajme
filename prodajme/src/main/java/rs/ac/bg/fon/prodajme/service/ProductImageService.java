package rs.ac.bg.fon.prodajme.service;

import rs.ac.bg.fon.prodajme.entity.ProductImage;

import java.util.List;

public interface ProductImageService {

    List<ProductImage> findByProductId(Integer productId);

    ProductImage addImage(Integer productId, String imageUrl);

    void deleteImage(Integer imageId);
}
