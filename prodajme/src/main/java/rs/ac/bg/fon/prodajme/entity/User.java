package rs.ac.bg.fon.prodajme.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "NAME", nullable = false, length = 50)
    private String name;

    @Column(name = "surname", nullable = false, length = 50)
    private String surname;

    @Column(name = "phone", length = 16, unique = true)
    private String phone;

    @Email
    @NotBlank
    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;

    @Column(name = "username", nullable = false, length = 30, unique = true)
    private String username;

    @Column(name = "PASSWORD", nullable = false, length = 255)
    private String password;

    @Column(name = "verificationCode", length = 6)
    private String verificationCode;

    @Column(nullable = false)
    private Boolean enabled = false;

    @Column(name = "ROLE", nullable = false, length = 10)
    private String role;

    @ManyToOne
    @JoinColumn(name = "idCity", nullable = false)
    private City city;
}
