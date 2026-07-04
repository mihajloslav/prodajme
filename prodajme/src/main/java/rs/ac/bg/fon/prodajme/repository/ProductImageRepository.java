package rs.ac.bg.fon.prodajme.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rs.ac.bg.fon.prodajme.entity.ProductImage;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {

    List<ProductImage> findByProductId(Integer productId);
}
