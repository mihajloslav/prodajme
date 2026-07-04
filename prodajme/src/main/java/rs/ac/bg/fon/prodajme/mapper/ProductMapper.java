package rs.ac.bg.fon.prodajme.mapper;

import rs.ac.bg.fon.prodajme.dto.ProductDto;
import rs.ac.bg.fon.prodajme.entity.Product;

public final class ProductMapper {

    private ProductMapper() {
    }

    public static ProductDto toDto(Product entity) {
        if (entity == null) {
            return null;
        }

        ProductDto dto = new ProductDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setImageUrl(entity.getImageUrl());
        dto.setDatePosted(entity.getDatePosted());
        dto.setStatus(entity.getStatus());

        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setUsername(entity.getUser().getUsername());
        }

        if (entity.getCategory() != null) {
            dto.setCategoryId(entity.getCategory().getId());
            dto.setCategoryName(entity.getCategory().getName());
        }

        return dto;
    }

    public static Product toEntity(ProductDto dto) {
        if (dto == null) {
            return null;
        }

        Product entity = new Product();
        entity.setId(dto.getId());
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setImageUrl(dto.getImageUrl());
        entity.setDatePosted(dto.getDatePosted());
        entity.setStatus(dto.getStatus());
        return entity;
    }
}
