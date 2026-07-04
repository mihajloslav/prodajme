package rs.ac.bg.fon.prodajme.mapper;

import rs.ac.bg.fon.prodajme.dto.CategoryDto;
import rs.ac.bg.fon.prodajme.entity.Category;

public final class CategoryMapper {

    private CategoryMapper() {
    }

    public static CategoryDto toDto(Category entity) {
        if (entity == null) {
            return null;
        }

        CategoryDto dto = new CategoryDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        return dto;
    }

    public static Category toEntity(CategoryDto dto) {
        if (dto == null) {
            return null;
        }

        Category entity = new Category();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        return entity;
    }
}
