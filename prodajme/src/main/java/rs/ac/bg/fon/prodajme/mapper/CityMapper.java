package rs.ac.bg.fon.prodajme.mapper;

import rs.ac.bg.fon.prodajme.dto.CityDto;
import rs.ac.bg.fon.prodajme.entity.City;

public final class CityMapper {

    private CityMapper() {
    }

    public static CityDto toDto(City entity) {
        if (entity == null) {
            return null;
        }

        CityDto dto = new CityDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        return dto;
    }

    public static City toEntity(CityDto dto) {
        if (dto == null) {
            return null;
        }

        City entity = new City();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        return entity;
    }
}
