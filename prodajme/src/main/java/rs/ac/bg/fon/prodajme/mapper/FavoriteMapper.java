package rs.ac.bg.fon.prodajme.mapper;

import rs.ac.bg.fon.prodajme.dto.FavoriteDto;
import rs.ac.bg.fon.prodajme.entity.Favorite;

public final class FavoriteMapper {

    private FavoriteMapper() {
    }

    public static FavoriteDto toDto(Favorite entity) {
        if (entity == null) {
            return null;
        }

        FavoriteDto dto = new FavoriteDto();
        dto.setId(entity.getId());
        dto.setDateAdded(entity.getDateAdded());

        dto.setUser(UserMapper.toNestedDto(entity.getUser()));
        dto.setProduct(ProductMapper.toNestedDto(entity.getProduct()));

        return dto;
    }

    public static Favorite toEntity(FavoriteDto dto) {
        if (dto == null) {
            return null;
        }

        Favorite entity = new Favorite();
        entity.setId(dto.getId());
        entity.setDateAdded(dto.getDateAdded());
        return entity;
    }
}
