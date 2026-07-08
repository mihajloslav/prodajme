package rs.ac.bg.fon.prodajme.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rs.ac.bg.fon.prodajme.dto.ReviewDto;
import rs.ac.bg.fon.prodajme.mapper.ReviewMapper;
import rs.ac.bg.fon.prodajme.response.ApiResponse;
import rs.ac.bg.fon.prodajme.response.ApiResponseFactory;
import rs.ac.bg.fon.prodajme.service.ReviewService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllReviews() {
        List<ReviewDto> reviews = reviewService.findAll()
                .stream()
                .map(ReviewMapper::toDto)
                .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Recenzije su uspešno učitane", Map.of("reviews", reviews)));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse> getReviewsByProductId(@PathVariable Integer productId) {
        List<ReviewDto> reviews = reviewService.findByProductId(productId)
            .stream()
            .map(ReviewMapper::toDto)
            .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Recenzije su uspešno učitane", Map.of("reviews", reviews)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createReview(@RequestBody ReviewDto reviewDto) {
        ReviewDto savedReview = ReviewMapper.toDto(
            reviewService.createReview(
                reviewDto.getReviewer().getId(),
                reviewDto.getReviewed().getId(),
                reviewDto.getProduct().getId(),
                reviewDto.getRating(),
                reviewDto.getComment()
            )
        );

        ApiResponse response = ApiResponseFactory.created("Recenzija je uspešno kreirana", Map.of("review", savedReview));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
