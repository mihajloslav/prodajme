package rs.ac.bg.fon.prodajme.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import rs.ac.bg.fon.prodajme.enums.UserRole;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Integer id;
    private String name;
    private String surname;
    private String phone;
    private String email;
    private String username;
    private UserRole role;
    private CityDto city;
}
