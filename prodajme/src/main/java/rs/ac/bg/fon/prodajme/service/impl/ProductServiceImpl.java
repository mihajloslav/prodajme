package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import rs.ac.bg.fon.prodajme.entity.Category;
import rs.ac.bg.fon.prodajme.entity.Purchase;
import rs.ac.bg.fon.prodajme.entity.Product;
import rs.ac.bg.fon.prodajme.entity.ProductImage;
import rs.ac.bg.fon.prodajme.entity.User;
import rs.ac.bg.fon.prodajme.enums.ProductStatus;
import rs.ac.bg.fon.prodajme.exception.ResourceNotFoundException;
import rs.ac.bg.fon.prodajme.repository.CategoryRepository;
import rs.ac.bg.fon.prodajme.repository.FavoriteRepository;
import rs.ac.bg.fon.prodajme.repository.PurchaseRepository;
import rs.ac.bg.fon.prodajme.repository.ProductRepository;
import rs.ac.bg.fon.prodajme.repository.UserRepository;
import rs.ac.bg.fon.prodajme.service.MailService;
import rs.ac.bg.fon.prodajme.service.ProductService;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private static final ProductStatus STATUS_DELETED = ProductStatus.DELETED;

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FavoriteRepository favoriteRepository;
    private final PurchaseRepository purchaseRepository;
    private final MailService mailService;

    public ProductServiceImpl(ProductRepository productRepository,
                              UserRepository userRepository,
                              CategoryRepository categoryRepository,
                              FavoriteRepository favoriteRepository,
                              PurchaseRepository purchaseRepository,
                              MailService mailService) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.favoriteRepository = favoriteRepository;
        this.purchaseRepository = purchaseRepository;
        this.mailService = mailService;
    }

    @Override
    public List<Product> findAll() {
        return productRepository.findByStatusNot(STATUS_DELETED);
    }

    @Override
    public Product findById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proizvod nije pronađen."));

        if (product.getStatus() == STATUS_DELETED) {
            throw new ResourceNotFoundException("Proizvod više nije dostupan.");
        }

        return product;
    }

    @Override
    public List<Product> findByStatus(String status) {
        if (status == null || status.isBlank()) {
            return List.of();
        }

        ProductStatus parsedStatus;
        try {
            parsedStatus = ProductStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            return List.of();
        }

        if (parsedStatus == STATUS_DELETED) {
            return List.of();
        }

        return productRepository.findByStatus(parsedStatus);
    }

    @Override
    public List<Product> searchByTitle(String title) {
        return productRepository.findByTitleContainingIgnoreCaseAndStatusNot(title, STATUS_DELETED);
    }

    @Override
    public Product create(Product product) {
        if (product.getUser() == null || product.getUser().getId() == null) {
            throw new ResourceNotFoundException("Korisnik nije pronađen.");
        }

        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new ResourceNotFoundException("Kategorija nije pronađena.");
        }

        return create(product, product.getUser().getId(), product.getCategory().getId());
    }

    @Override
    public Product create(Product product, Integer userId, Integer categoryId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen."));

        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Kategorija nije pronađena."));

        if (product.getDatePosted() == null) {
            product.setDatePosted(LocalDateTime.now());
        }

        product.setUser(user);
        product.setCategory(category);

        if (product.getImages() != null) {
            for (ProductImage image : product.getImages()) {
                image.setProduct(product);
            }
        }

        return productRepository.save(product);
    }

    @Override
    public Product update(Integer id, Product product) {
        if (product.getUser() == null || product.getUser().getId() == null) {
            throw new ResourceNotFoundException("Korisnik nije pronađen.");
        }

        if (product.getCategory() == null || product.getCategory().getId() == null) {
            throw new ResourceNotFoundException("Kategorija nije pronađena.");
        }

        return update(id, product, product.getUser().getId(), product.getCategory().getId());
    }

    @Override
    public Product update(Integer id, Product product, Integer userId, Integer categoryId) {
        Product existingProduct = findById(id);
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen."));
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Kategorija nije pronađena."));

        existingProduct.setTitle(product.getTitle());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setDatePosted(product.getDatePosted());
        existingProduct.setStatus(product.getStatus());
        existingProduct.setUser(user);
        existingProduct.setCategory(category);

        existingProduct.getImages().clear();
        if (product.getImages() != null) {
            for (ProductImage image : product.getImages()) {
                image.setProduct(existingProduct);
                existingProduct.getImages().add(image);
            }
        }

        return productRepository.save(existingProduct);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proizvod nije pronađen."));

        product.setStatus(STATUS_DELETED);
        productRepository.save(product);
        favoriteRepository.deleteByProductId(id);
    }

    @Override
    @Transactional(readOnly = true)
    public void sendAdsReportToEmail(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Korisnik nije pronađen."));

        List<Product> products = productRepository.findByUserId(userId).stream()
                .filter(product -> product.getStatus() != STATUS_DELETED)
                .toList();

        if (products.isEmpty()) {
            throw new IllegalStateException("Nemate nijedan aktivan oglas za izveštaj.");
        }

        List<Integer> productIds = products.stream().map(Product::getId).toList();
        Map<Integer, Purchase> purchaseByProductId = purchaseRepository.findByProductIdIn(productIds).stream()
                .collect(Collectors.toMap(purchase -> purchase.getProduct().getId(), purchase -> purchase));

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Oglasi");
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "ID", "Naziv", "Opis", "Cena", "Kategorija", "Status",
                    "Datum postavljanja", "Grad", "Broj slika", "Kupac (ako postoji)", "Datum kupovine (ako postoji)"
            };

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy. HH:mm");
            int rowIndex = 1;
            for (Product product : products) {
                Row row = sheet.createRow(rowIndex++);
                Purchase purchase = purchaseByProductId.get(product.getId());

                row.createCell(0).setCellValue(product.getId());
                row.createCell(1).setCellValue(product.getTitle() != null ? product.getTitle() : "");
                row.createCell(2).setCellValue(product.getDescription() != null ? product.getDescription() : "");
                row.createCell(3).setCellValue(product.getPrice() != null ? product.getPrice().doubleValue() : 0d);
                row.createCell(4).setCellValue(product.getCategory() != null ? product.getCategory().getName() : "");
                row.createCell(5).setCellValue(product.getStatus() != null ? product.getStatus().name() : "");
                row.createCell(6).setCellValue(product.getDatePosted() != null ? product.getDatePosted().format(formatter) : "");
                row.createCell(7).setCellValue(product.getUser() != null && product.getUser().getCity() != null
                        ? product.getUser().getCity().getName()
                        : "");
                row.createCell(8).setCellValue(product.getImages() != null ? product.getImages().size() : 0);
                row.createCell(9).setCellValue(purchase != null && purchase.getBuyer() != null ? purchase.getBuyer().getName() + " " + purchase.getBuyer().getSurname() : "");
                row.createCell(10).setCellValue(purchase != null && purchase.getDatePurchased() != null ? purchase.getDatePurchased().format(formatter) : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);
            mailService.sendAdsReportEmail(user.getEmail(), "Izvestaj_Oglasa.xlsx", outputStream.toByteArray());
        } catch (Exception ex) {
            throw new IllegalStateException("Kreiranje ili slanje izveštaja nije uspelo.", ex);
        }
    }
}
