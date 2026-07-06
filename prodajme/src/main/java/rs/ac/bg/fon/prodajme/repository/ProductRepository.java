package rs.ac.bg.fon.prodajme.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rs.ac.bg.fon.prodajme.entity.Product;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findByStatus(String status);

    List<Product> findByStatusIgnoreCase(String status);

    List<Product> findByStatusNotIgnoreCase(String status);

    List<Product> findByTitleContainingIgnoreCase(String title);

    List<Product> findByTitleContainingIgnoreCaseAndStatusNotIgnoreCase(String title, String status);
}
