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
public class FavoriteDto {

    private Integer id;
    private LocalDateTime dateAdded;
    private Integer userId;
    private String username;
    private Integer productId;
    private String productTitle;
}
