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
    private Integer reviewerId;
    private String reviewerUsername;
    private Integer reviewedId;
    private String reviewedUsername;
    private Integer productId;
    private String productTitle;
}
