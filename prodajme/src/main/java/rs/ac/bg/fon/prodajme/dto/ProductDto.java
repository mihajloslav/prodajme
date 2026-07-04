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
public class ProductDto {

    private Integer id;
    private String title;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private LocalDateTime datePosted;
    private String status;
    private UserDto user;
    private CategoryDto category;
}
