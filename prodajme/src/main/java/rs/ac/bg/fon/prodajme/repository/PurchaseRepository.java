package rs.ac.bg.fon.prodajme.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rs.ac.bg.fon.prodajme.entity.Purchase;

import java.util.Collection;
import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {

	boolean existsByProductId(Integer productId);

	void deleteByProductId(Integer productId);

    List<Purchase> findByProductIdIn(Collection<Integer> productIds);
}
