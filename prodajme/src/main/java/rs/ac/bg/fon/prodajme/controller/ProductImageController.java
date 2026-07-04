package rs.ac.bg.fon.prodajme.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rs.ac.bg.fon.prodajme.dto.ProductImageDto;
import rs.ac.bg.fon.prodajme.mapper.ProductImageMapper;
import rs.ac.bg.fon.prodajme.response.ApiResponse;
import rs.ac.bg.fon.prodajme.response.ApiResponseFactory;
import rs.ac.bg.fon.prodajme.service.ProductImageService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product-images")
public class ProductImageController {

    private final ProductImageService productImageService;

    public ProductImageController(ProductImageService productImageService) {
        this.productImageService = productImageService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse> getImagesByProductId(@PathVariable Integer productId) {
        List<ProductImageDto> images = productImageService.findByProductId(productId)
                .stream()
                .map(ProductImageMapper::toDto)
                .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Product images fetched successfully", Map.of("images", images)));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ApiResponse> addImage(@PathVariable Integer productId, @RequestBody ProductImageDto imageDto) {
        ProductImageDto savedImage = ProductImageMapper.toDto(
                productImageService.addImage(productId, imageDto.getImageUrl())
        );

        ApiResponse response = ApiResponseFactory.created("Product image added successfully", Map.of("image", savedImage));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<ApiResponse> deleteImage(@PathVariable Integer imageId) {
        productImageService.deleteImage(imageId);
        return ResponseEntity.ok(ApiResponseFactory.success("Product image deleted successfully"));
    }
}
