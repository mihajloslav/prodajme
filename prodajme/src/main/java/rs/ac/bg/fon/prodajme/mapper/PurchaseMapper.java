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

        if (entity.getBuyer() != null) {
            dto.setBuyerId(entity.getBuyer().getId());
            dto.setBuyerUsername(entity.getBuyer().getUsername());
        }

        if (entity.getProduct() != null) {
            dto.setProductId(entity.getProduct().getId());
            dto.setProductTitle(entity.getProduct().getTitle());
        }

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
