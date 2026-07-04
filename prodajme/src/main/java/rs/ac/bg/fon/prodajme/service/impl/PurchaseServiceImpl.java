package rs.ac.bg.fon.prodajme.service.impl;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.prodajme.entity.Product;
import rs.ac.bg.fon.prodajme.entity.Purchase;
import rs.ac.bg.fon.prodajme.entity.User;
import rs.ac.bg.fon.prodajme.exception.BadRequestException;
import rs.ac.bg.fon.prodajme.exception.ResourceNotFoundException;
import rs.ac.bg.fon.prodajme.repository.ProductRepository;
import rs.ac.bg.fon.prodajme.repository.PurchaseRepository;
import rs.ac.bg.fon.prodajme.repository.UserRepository;
import rs.ac.bg.fon.prodajme.service.PurchaseService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseServiceImpl implements PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public PurchaseServiceImpl(PurchaseRepository purchaseRepository,
                               UserRepository userRepository,
                               ProductRepository productRepository) {
        this.purchaseRepository = purchaseRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<Purchase> findAll() {
        return purchaseRepository.findAll();
    }

    @Override
    public Purchase findById(Integer id) {
        return purchaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found"));
    }

    @Override
    @Transactional
    public Purchase createPurchase(Integer buyerId, Integer productId, BigDecimal finalPrice) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getUser() != null && product.getUser().getId().equals(buyerId)) {
            throw new BadRequestException("You cannot buy your own product");
        }

        if (purchaseRepository.existsByProductId(productId)) {
            throw new BadRequestException("Purchase for product already exists");
        }

        Purchase purchase = new Purchase();
        purchase.setBuyer(buyer);
        purchase.setProduct(product);
        purchase.setFinalPrice(finalPrice);
        purchase.setDatePurchased(LocalDateTime.now());

        Purchase savedPurchase = purchaseRepository.save(purchase);

        product.setStatus("SOLD");
        productRepository.save(product);

        return savedPurchase;
    }
}
