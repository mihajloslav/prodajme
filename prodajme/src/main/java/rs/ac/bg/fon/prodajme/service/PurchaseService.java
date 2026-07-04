package rs.ac.bg.fon.prodajme.service;

import rs.ac.bg.fon.prodajme.entity.Purchase;

import java.math.BigDecimal;
import java.util.List;

public interface PurchaseService {

    List<Purchase> findAll();

    Purchase findById(Integer id);

    Purchase createPurchase(Integer buyerId, Integer productId, BigDecimal finalPrice);
}
