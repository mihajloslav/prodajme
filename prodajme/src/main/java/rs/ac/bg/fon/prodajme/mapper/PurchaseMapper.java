package rs.ac.bg.fon.prodajme.mapper;

import rs.ac.bg.fon.prodajme.dto.PurchaseDto;
import rs.ac.bg.fon.prodajme.entity.Purchase;

public final class PurchaseMapper {

    private PurchaseMapper() {
    }

    public static PurchaseDto toDto(Purchase entity) {
        if (entity == null) {
            return null;
        }

        PurchaseDto dto = new PurchaseDto();
        dto.setId(entity.getId());
        dto.setDatePurchased(entity.getDatePurchased());
        dto.setFinalPrice(entity.getFinalPrice());

        dto.setBuyer(UserMapper.toNestedDto(entity.getBuyer()));
        dto.setProduct(ProductMapper.toNestedDto(entity.getProduct()));

        return dto;
    }

    public static Purchase toEntity(PurchaseDto dto) {
        if (dto == null) {
            return null;
        }

        Purchase entity = new Purchase();
        entity.setId(dto.getId());
        entity.setDatePurchased(dto.getDatePurchased());
        entity.setFinalPrice(dto.getFinalPrice());
        return entity;
    }
}
