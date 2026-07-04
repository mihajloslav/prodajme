package rs.ac.bg.fon.prodajme.service;

import rs.ac.bg.fon.prodajme.entity.Review;

import java.util.List;

public interface ReviewService {

    List<Review> findAll();

    List<Review> findByProductId(Integer productId);

    Review createReview(Integer reviewerId, Integer reviewedId, Integer productId, Integer rating, String comment);
}
