package rs.ac.bg.fon.prodajme.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import rs.ac.bg.fon.prodajme.enums.UserRole;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {

    private String name;
    private String surname;
    private String phone;
    @NotBlank
    @Email
    @Size(max = 100)
    private String email;
    private String username;
    private String password;
    private UserRole role;
    private Integer cityId;
}