package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.entity.Favorite;
import rs.ac.bg.fon.prodajme.entity.Product;
import rs.ac.bg.fon.prodajme.entity.User;
import rs.ac.bg.fon.prodajme.exception.BadRequestException;
import rs.ac.bg.fon.prodajme.exception.ResourceNotFoundException;
import rs.ac.bg.fon.prodajme.repository.FavoriteRepository;
import rs.ac.bg.fon.prodajme.repository.ProductRepository;
import rs.ac.bg.fon.prodajme.repository.UserRepository;
import rs.ac.bg.fon.prodajme.service.FavoriteService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public FavoriteServiceImpl(FavoriteRepository favoriteRepository,
                               UserRepository userRepository,
                               ProductRepository productRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<Favorite> findByUserId(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        return favoriteRepository.findByUserId(userId);
    }

    @Override
    public Favorite addToFavorites(Integer userId, Integer productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (favoriteRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new BadRequestException("Favorite already exists");
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setProduct(product);
        favorite.setDateAdded(LocalDateTime.now());

        return favoriteRepository.save(favorite);
    }

    @Override
    public void removeFromFavorites(Integer userId, Integer productId) {
        Favorite favorite = favoriteRepository.findByUserIdAndProductId(userId, productId)
            .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));

        favoriteRepository.delete(favorite);
    }
}
