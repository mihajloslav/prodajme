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
import rs.ac.bg.fon.prodajme.dto.UserDto;
import rs.ac.bg.fon.prodajme.mapper.UserMapper;
import rs.ac.bg.fon.prodajme.response.ApiResponse;
import rs.ac.bg.fon.prodajme.response.ApiResponseFactory;
import rs.ac.bg.fon.prodajme.service.UserService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<UserDto> users = userService.findAll()
                .stream()
                .map(UserMapper::toDto)
                .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Users fetched successfully", Map.of("users", users)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getUserById(@PathVariable Integer id) {
        UserDto user = UserMapper.toDto(userService.findById(id));
        return ResponseEntity.ok(ApiResponseFactory.success("User fetched successfully", Map.of("user", user)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> registerUser(@RequestBody UserDto userDto) {
        UserDto savedUser = UserMapper.toDto(
            userService.register(UserMapper.toEntity(userDto), userDto.getCityId())
        );

        ApiResponse response = ApiResponseFactory.created("User registered successfully", Map.of("user", savedUser));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateUser(@PathVariable Integer id, @RequestBody UserDto userDto) {
        UserDto updatedUser = UserMapper.toDto(
            userService.update(id, UserMapper.toEntity(userDto), userDto.getCityId())
        );

        return ResponseEntity.ok(ApiResponseFactory.success("User updated successfully", Map.of("user", updatedUser)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Integer id) {
        userService.delete(id);
        return ResponseEntity.ok(ApiResponseFactory.success("User deleted successfully"));
    }

}
