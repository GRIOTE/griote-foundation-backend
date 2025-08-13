package Griote.service_depot_doc.filestorage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {
    private final Path rootLocation = Paths.get("uploads");
    private final long MAX_SIZE = 100 * 1024 * 1024; // 100 MB

    public FileStorageService() throws IOException {
        Files.createDirectories(rootLocation);
    }

    public String storeFile(MultipartFile file, String filename) throws IOException {
        if (file.getSize() > MAX_SIZE) {
            throw new IOException("File size exceeds 100MB");
        }
        Path destination = rootLocation.resolve(filename);
        Files.copy(file.getInputStream(), destination);
        return destination.toString();
    }

    public byte[] loadFile(String filename) throws IOException {
        Path filePath = rootLocation.resolve(filename);
        return Files.readAllBytes(filePath);
    }
}
