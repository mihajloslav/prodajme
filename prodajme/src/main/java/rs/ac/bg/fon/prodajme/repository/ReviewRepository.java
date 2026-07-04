package rs.ac.bg.fon.prodajme.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rs.ac.bg.fon.prodajme.entity.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {

	List<Review> findByProductId(Integer productId);
}
