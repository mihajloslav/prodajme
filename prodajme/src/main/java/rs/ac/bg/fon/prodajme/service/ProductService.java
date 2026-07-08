package rs.ac.bg.fon.prodajme.service;

import rs.ac.bg.fon.prodajme.entity.Product;

import java.util.List;

public interface ProductService {

    List<Product> findAll();

    Product findById(Integer id);

    List<Product> findByStatus(String status);

    List<Product> searchByTitle(String title);

    Product create(Product product);

    Product create(Product product, Integer userId, Integer categoryId);

    Product update(Integer id, Product product);

    Product update(Integer id, Product product, Integer userId, Integer categoryId);

    void delete(Integer id);

    void sendAdsReportToEmail(Integer userId);
}
