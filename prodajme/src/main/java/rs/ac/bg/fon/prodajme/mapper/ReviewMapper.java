package rs.ac.bg.fon.prodajme.mapper;

import rs.ac.bg.fon.prodajme.dto.ReviewDto;
import rs.ac.bg.fon.prodajme.entity.Review;

public final class ReviewMapper {

    private ReviewMapper() {
    }

    public static ReviewDto toDto(Review entity) {
        if (entity == null) {
            return null;
        }

        ReviewDto dto = new ReviewDto();
        dto.setId(entity.getId());
        dto.setRating(entity.getRating());
        dto.setComment(entity.getComment());
        dto.setDateCreated(entity.getDateCreated());

        if (entity.getReviewer() != null) {
            dto.setReviewerId(entity.getReviewer().getId());
            dto.setReviewerUsername(entity.getReviewer().getUsername());
        }

        if (entity.getReviewed() != null) {
            dto.setReviewedId(entity.getReviewed().getId());
            dto.setReviewedUsername(entity.getReviewed().getUsername());
        }

        if (entity.getProduct() != null) {
            dto.setProductId(entity.getProduct().getId());
            dto.setProductTitle(entity.getProduct().getTitle());
        }

        return dto;
    }

    public static Review toEntity(ReviewDto dto) {
        if (dto == null) {
            return null;
        }

        Review entity = new Review();
        entity.setId(dto.getId());
        entity.setRating(dto.getRating());
        entity.setComment(dto.getComment());
        entity.setDateCreated(dto.getDateCreated());
        return entity;
    }
}
