package rs.ac.bg.fon.prodajme.mapper;

import rs.ac.bg.fon.prodajme.dto.MessageDto;
import rs.ac.bg.fon.prodajme.entity.Message;

public final class MessageMapper {

    private MessageMapper() {
    }

    public static MessageDto toDto(Message entity) {
        if (entity == null) {
            return null;
        }

        MessageDto dto = new MessageDto();
        dto.setId(entity.getId());
        dto.setText(entity.getText());
        dto.setDateSent(entity.getDateSent());

        dto.setSender(UserMapper.toNestedDto(entity.getSender()));
        dto.setReceiver(UserMapper.toNestedDto(entity.getReceiver()));
        dto.setProduct(ProductMapper.toNestedDto(entity.getProduct()));

        return dto;
    }

    public static Message toEntity(MessageDto dto) {
        if (dto == null) {
            return null;
        }

        Message entity = new Message();
        entity.setId(dto.getId());
        entity.setText(dto.getText());
        entity.setDateSent(dto.getDateSent());
        return entity;
    }
}
