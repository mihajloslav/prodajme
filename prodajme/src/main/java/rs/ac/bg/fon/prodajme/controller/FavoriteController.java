package rs.ac.bg.fon.prodajme.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rs.ac.bg.fon.prodajme.dto.FavoriteDto;
import rs.ac.bg.fon.prodajme.mapper.FavoriteMapper;
import rs.ac.bg.fon.prodajme.response.ApiResponse;
import rs.ac.bg.fon.prodajme.response.ApiResponseFactory;
import rs.ac.bg.fon.prodajme.service.FavoriteService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getFavoritesByUserId(@PathVariable Integer userId) {
        List<FavoriteDto> favorites = favoriteService.findByUserId(userId)
            .stream()
            .map(FavoriteMapper::toDto)
            .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Omiljeni oglasi su uspešno učitani", Map.of("favorites", favorites)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> addToFavorites(@RequestBody FavoriteDto favoriteDto) {
        FavoriteDto savedFavorite = FavoriteMapper.toDto(
            favoriteService.addToFavorites(favoriteDto.getUser().getId(), favoriteDto.getProduct().getId())
        );

        ApiResponse response = ApiResponseFactory.created("Oglas je uspešno dodat u omiljene", Map.of("favorite", savedFavorite));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/user/{userId}/product/{productId}")
    public ResponseEntity<ApiResponse> removeFromFavorites(@PathVariable Integer userId, @PathVariable Integer productId) {
        favoriteService.removeFromFavorites(userId, productId);
        return ResponseEntity.ok(ApiResponseFactory.success("Oglas je uspešno uklonjen iz omiljenih"));
    }

}
