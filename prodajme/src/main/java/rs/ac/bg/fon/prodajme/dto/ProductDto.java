package rs.ac.bg.fon.prodajme.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import rs.ac.bg.fon.prodajme.enums.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

    private Integer id;
    private String title;
    private String description;
    private BigDecimal price;
    private List<ProductImageDto> images;
    private LocalDateTime datePosted;
    private ProductStatus status;
    private UserDto user;
    private CategoryDto category;
}
