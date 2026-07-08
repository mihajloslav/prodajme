package rs.ac.bg.fon.prodajme.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rs.ac.bg.fon.prodajme.entity.Product;
import rs.ac.bg.fon.prodajme.enums.ProductStatus;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByStatus(ProductStatus status);

    List<Product> findByStatusNot(ProductStatus status);

    List<Product> findByTitleContainingIgnoreCase(String title);

    List<Product> findByTitleContainingIgnoreCaseAndStatusNot(String title, ProductStatus status);

    List<Product> findByUserId(Integer userId);
}
