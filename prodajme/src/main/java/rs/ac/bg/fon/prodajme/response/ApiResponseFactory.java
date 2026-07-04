package rs.ac.bg.fon.prodajme.response;

import org.springframework.http.HttpStatus;

import java.util.Map;

public final class ApiResponseFactory {

    private ApiResponseFactory() {
    }

    public static ApiResponse success(String message) {
        return new ApiResponse(message, HttpStatus.OK);
    }

    public static ApiResponse success(String message, Map<String, Object> data) {
        return new ApiResponse(message, data, HttpStatus.OK);
    }

    public static ApiResponse error(String message, HttpStatus status) {
        return new ApiResponse(message, status);
    }
}
