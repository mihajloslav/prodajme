package rs.ac.bg.fon.prodajme.service;

import rs.ac.bg.fon.prodajme.entity.Favorite;

import java.util.List;

public interface FavoriteService {

    List<Favorite> findByUserId(Integer userId);

    Favorite addToFavorites(Integer userId, Integer productId);

    void removeFromFavorites(Integer userId, Integer productId);
}
