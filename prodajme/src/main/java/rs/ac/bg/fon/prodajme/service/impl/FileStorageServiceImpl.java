package rs.ac.bg.fon.prodajme.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import rs.ac.bg.fon.prodajme.exception.BadRequestException;
import rs.ac.bg.fon.prodajme.service.FileStorageService;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024 * 1024;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    private final Path uploadDir;

    public FileStorageServiceImpl(@Value("${app.upload.dir}") String uploadDir) {
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @Override
    public String storeProductImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Fajl je obavezan.");
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BadRequestException("Veličina slike mora biti manja od 5MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BadRequestException("Dozvoljene su samo JPEG, PNG i WEBP slike.");
        }

        String extension = resolveExtension(file.getOriginalFilename(), contentType);
        String fileName = UUID.randomUUID() + extension;

        try {
            Files.createDirectories(uploadDir);
            Path targetPath = uploadDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException ex) {
            throw new RuntimeException("Nije uspelo čuvanje slike", ex);
        }

        return "/uploads/products/" + fileName;
    }

    private String resolveExtension(String originalFilename, String contentType) {
        if (originalFilename != null) {
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex >= 0 && dotIndex < originalFilename.length() - 1) {
                return originalFilename.substring(dotIndex);
            }
        }

        return switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> "";
        };
    }
}
