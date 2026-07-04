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

        dto.setReviewer(UserMapper.toNestedDto(entity.getReviewer()));
        dto.setReviewed(UserMapper.toNestedDto(entity.getReviewed()));
        dto.setProduct(ProductMapper.toNestedDto(entity.getProduct()));

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
