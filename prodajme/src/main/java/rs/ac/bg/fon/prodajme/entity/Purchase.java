package rs.ac.bg.fon.prodajme.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "purchase")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "datePurchased")
    private LocalDateTime datePurchased;

    @Column(name = "finalPrice", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalPrice;

    @ManyToOne
    @JoinColumn(name = "idBuyer", nullable = false)
    private User buyer;

    @OneToOne
    @JoinColumn(name = "idProduct", nullable = false, unique = true)
    private Product product;
}
