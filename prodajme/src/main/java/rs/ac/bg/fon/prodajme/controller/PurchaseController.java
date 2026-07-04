package rs.ac.bg.fon.prodajme.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import rs.ac.bg.fon.prodajme.dto.PurchaseDto;
import rs.ac.bg.fon.prodajme.mapper.PurchaseMapper;
import rs.ac.bg.fon.prodajme.response.ApiResponse;
import rs.ac.bg.fon.prodajme.response.ApiResponseFactory;
import rs.ac.bg.fon.prodajme.service.PurchaseService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllPurchases() {
        List<PurchaseDto> purchases = purchaseService.findAll()
                .stream()
                .map(PurchaseMapper::toDto)
                .toList();

        return ResponseEntity.ok(ApiResponseFactory.success("Purchases fetched successfully", Map.of("purchases", purchases)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getPurchaseById(@PathVariable Integer id) {
        PurchaseDto purchase = PurchaseMapper.toDto(purchaseService.findById(id));
        return ResponseEntity.ok(ApiResponseFactory.success("Purchase fetched successfully", Map.of("purchase", purchase)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse> createPurchase(@RequestBody PurchaseDto purchaseDto) {
        PurchaseDto savedPurchase = PurchaseMapper.toDto(
            purchaseService.createPurchase(
                purchaseDto.getBuyerId(),
                purchaseDto.getProductId(),
                purchaseDto.getFinalPrice()
            )
        );

        ApiResponse response = ApiResponseFactory.created("Purchase created successfully", Map.of("purchase", savedPurchase));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}
