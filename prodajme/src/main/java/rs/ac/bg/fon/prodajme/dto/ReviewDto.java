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
public class ReviewDto {

    private Integer id;
    private Integer rating;
    private String comment;
    private LocalDateTime dateCreated;
    private UserDto reviewer;
    private UserDto reviewed;
    private ProductDto product;
}
