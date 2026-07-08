package rs.ac.bg.fon.prodajme.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rs.ac.bg.fon.prodajme.dto.ForgotPasswordDto;
import rs.ac.bg.fon.prodajme.dto.LoginDto;
import rs.ac.bg.fon.prodajme.dto.RegisterDto;
import rs.ac.bg.fon.prodajme.dto.ResetPasswordDto;
import rs.ac.bg.fon.prodajme.dto.UserDto;
import rs.ac.bg.fon.prodajme.dto.VerifyEmailDto;
import rs.ac.bg.fon.prodajme.mapper.UserMapper;
import rs.ac.bg.fon.prodajme.response.ApiResponse;
import rs.ac.bg.fon.prodajme.response.ApiResponseFactory;
import rs.ac.bg.fon.prodajme.service.UserService;
import rs.ac.bg.fon.prodajme.service.JwtService;

import java.util.List;
import java.util.Map;
import rs.ac.bg.fon.prodajme.entity.User;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<UserDto> users = userService.findAll()
                .stream()
                .map(UserMapper::toDto)
                .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Korisnici su uspešno učitani", Map.of("users", users)));
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Integer id) {
        UserDto user = UserMapper.toDto(userService.findById(id));
        return ResponseEntity.ok(ApiResponseFactory.success("Korisnik je uspešno učitan", Map.of("user", user)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterDto registerDto) {
        UserDto savedUser = UserMapper.toDto(
            userService.register(UserMapper.toEntity(registerDto), registerDto.getCityId())
        );

        ApiResponse response = ApiResponseFactory.created("Korisnik je uspešno registrovan", Map.of("user", savedUser));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> loginUser(@RequestBody LoginDto loginDto) {
        User userEntity = userService.login(loginDto.getEmail(), loginDto.getPassword());
        UserDto user = UserMapper.toDto(userEntity);
        String token = jwtService.generateToken(userEntity);

        return ResponseEntity.ok(ApiResponseFactory.success("Prijava korisnika je uspešna", Map.of(
            "token", token,
            "user", user
        )));
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verifyEmail(@RequestBody VerifyEmailDto verifyEmailDto) {
        UserDto user = UserMapper.toDto(
                userService.verifyEmail(verifyEmailDto.getEmail(), verifyEmailDto.getCode())
        );

        return ResponseEntity.ok(ApiResponseFactory.success("Email je uspešno verifikovan", Map.of("user", user)));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestBody ForgotPasswordDto forgotPasswordDto) {
        userService.forgotPassword(forgotPasswordDto.getEmail());
        return ResponseEntity.ok(ApiResponseFactory.success("Kod za reset lozinke je uspešno poslat"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(@RequestBody ResetPasswordDto resetPasswordDto) {
        userService.resetPassword(
                resetPasswordDto.getEmail(),
                resetPasswordDto.getCode(),
                resetPasswordDto.getNewPassword()
        );
        return ResponseEntity.ok(ApiResponseFactory.success("Lozinka je uspešno resetovana"));
    }

    @PutMapping("/{id:\\d+}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Integer id, @RequestBody UserDto userDto) {
        UserDto updatedUser = UserMapper.toDto(
            userService.update(id, UserMapper.toEntity(userDto), userDto.getCity().getId())
        );

        return ResponseEntity.ok(ApiResponseFactory.success("Korisnik je uspešno ažuriran", Map.of("user", updatedUser)));
    }

    @DeleteMapping("/{id:\\d+}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Integer id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponseFactory.success("Korisnik je uspešno obrisan"));
    }

}
