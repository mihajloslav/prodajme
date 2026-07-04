package rs.ac.bg.fon.prodajme.mapper;

import rs.ac.bg.fon.prodajme.dto.ProductImageDto;
import rs.ac.bg.fon.prodajme.entity.ProductImage;

public final class ProductImageMapper {

    private ProductImageMapper() {
    }

    public static ProductImageDto toDto(ProductImage entity) {
        if (entity == null) {
            return null;
        }

        ProductImageDto dto = new ProductImageDto();
        dto.setId(entity.getId());
        dto.setImageUrl(entity.getImageUrl());
        return dto;
    }

    public static ProductImage toEntity(ProductImageDto dto) {
        if (dto == null) {
            return null;
        }

        ProductImage entity = new ProductImage();
        entity.setId(dto.getId());
        entity.setImageUrl(dto.getImageUrl());
        return entity;
    }
}
