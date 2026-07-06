package rs.ac.bg.fon.prodajme.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "review")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "dateCreated")
    private LocalDateTime dateCreated;

    @ManyToOne
    @JoinColumn(name = "idReviewer", nullable = false)
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "idReviewed", nullable = false)
    private User reviewed;

    @ManyToOne
    @JoinColumn(name = "idProduct", nullable = false)
    private Product product;
}
