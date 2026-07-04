package rs.ac.bg.fon.prodajme.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import rs.ac.bg.fon.prodajme.entity.Favorite;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {

    List<Favorite> findByUserId(Integer userId);

    boolean existsByUserIdAndProductId(Integer userId, Integer productId);

    Optional<Favorite> findByUserIdAndProductId(Integer userId, Integer productId);
}
