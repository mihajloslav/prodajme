package rs.ac.bg.fon.prodajme.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rs.ac.bg.fon.prodajme.dto.CityDto;
import rs.ac.bg.fon.prodajme.mapper.CityMapper;
import rs.ac.bg.fon.prodajme.response.ApiResponse;
import rs.ac.bg.fon.prodajme.response.ApiResponseFactory;
import rs.ac.bg.fon.prodajme.service.CityService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllCities() {
        List<CityDto> cities = cityService.findAll()
                .stream()
                .map(CityMapper::toDto)
                .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Cities fetched successfully", Map.of("cities", cities)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCityById(@PathVariable Integer id) {
        CityDto city = CityMapper.toDto(cityService.findById(id));
        return ResponseEntity.ok(ApiResponseFactory.success("City fetched successfully", Map.of("city", city)));
    }
}
