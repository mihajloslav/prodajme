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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import rs.ac.bg.fon.prodajme.dto.SendAdsReportRequestDto;
import rs.ac.bg.fon.prodajme.dto.ProductDto;
import rs.ac.bg.fon.prodajme.mapper.ProductMapper;
import rs.ac.bg.fon.prodajme.response.ApiResponse;
import rs.ac.bg.fon.prodajme.response.ApiResponseFactory;
import rs.ac.bg.fon.prodajme.service.ProductService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllProducts() {
        List<ProductDto> products = productService.findAll()
                .stream()
                .map(ProductMapper::toDto)
                .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Oglasi su uspešno učitani", Map.of("products", products)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable Integer id) {
        ProductDto product = ProductMapper.toDto(productService.findById(id));
        return ResponseEntity.ok(ApiResponseFactory.success("Oglas je uspešno učitan", Map.of("product", product)));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse> getProductsByStatus(@PathVariable String status) {
        List<ProductDto> products = productService.findByStatus(status)
                .stream()
                .map(ProductMapper::toDto)
                .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Oglasi su uspešno učitani", Map.of("products", products)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchProducts(@RequestParam String title) {
        List<ProductDto> products = productService.searchByTitle(title)
                .stream()
                .map(ProductMapper::toDto)
                .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Oglasi su uspešno učitani", Map.of("products", products)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createProduct(@RequestBody ProductDto productDto) {
        ProductDto savedProduct = ProductMapper.toDto(
            productService.create(
                ProductMapper.toEntity(productDto),
                productDto.getUser().getId(),
                productDto.getCategory().getId()
            )
        );

        ApiResponse response = ApiResponseFactory.created("Oglas je uspešno kreiran", Map.of("product", savedProduct));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateProduct(@PathVariable Integer id, @RequestBody ProductDto productDto) {
        ProductDto updatedProduct = ProductMapper.toDto(
            productService.update(
                id,
                ProductMapper.toEntity(productDto),
                productDto.getUser().getId(),
                productDto.getCategory().getId()
            )
        );

        return ResponseEntity.ok(ApiResponseFactory.success("Oglas je uspešno ažuriran", Map.of("product", updatedProduct)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.ok(ApiResponseFactory.success("Oglas je uspešno obrisan"));
    }

    @PostMapping("/report/email")
    public ResponseEntity<ApiResponse> sendAdsReportToEmail(@RequestBody SendAdsReportRequestDto requestDto) {
        productService.sendAdsReportToEmail(requestDto.getUserId());
        return ResponseEntity.ok(ApiResponseFactory.success("Izveštaj je uspešno poslat na Vašu email adresu."));
    }

}
