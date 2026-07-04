package rs.ac.bg.fon.prodajme.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseDto {

    private Integer id;
    private LocalDateTime datePurchased;
    private BigDecimal finalPrice;
    private Integer buyerId;
    private String buyerUsername;
    private Integer productId;
    private String productTitle;
}
