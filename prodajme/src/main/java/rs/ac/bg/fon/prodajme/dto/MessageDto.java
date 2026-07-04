package rs.ac.bg.fon.prodajme.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageDto {

    private Integer id;
    private String text;
    private LocalDateTime dateSent;
    private Integer senderId;
    private String senderUsername;
    private Integer receiverId;
    private String receiverUsername;
    private Integer productId;
    private String productTitle;
}
