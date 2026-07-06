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
@Table(name = "message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "text", nullable = false, columnDefinition = "TEXT")
    private String text;

    @Column(name = "dateSent")
    private LocalDateTime dateSent;

    @ManyToOne
    @JoinColumn(name = "idSender", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "idReceiver", nullable = false)
    private User receiver;

    @ManyToOne
    @JoinColumn(name = "idProduct", nullable = false)
    private Product product;
}
