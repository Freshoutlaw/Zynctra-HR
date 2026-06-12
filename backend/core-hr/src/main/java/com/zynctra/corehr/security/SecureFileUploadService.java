package com.zynctra.corehr.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Set;
import java.util.UUID;

/**
 * Secure file upload handler for profile photos and documents.
 * 
 * SECURITY INVARIANTS:
 * - File type validation by magic bytes (not extension)
 * - File size limits enforced
 * - Random filename (no original filename used)
 * - Stored outside web root
 * - No executable content allowed
 */
@Service
public class SecureFileUploadService {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final Set<String> ALLOWED_MAGIC_BYTES = Set.of(
        "FFD8FF",   // JPEG
        "89504E47", // PNG
        "47494638"  // GIF
    );
    private static final Set<String> BLOCKED_EXTENSIONS = Set.of(
        "exe", "bat", "cmd", "sh", "php", "jsp", "asp", "aspx", "jar", "war"
    );

    private final Path uploadRoot;

    public SecureFileUploadService() {
        this.uploadRoot = Paths.get(System.getProperty("java.io.tmpdir"), "zynctra-uploads");
        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }

    public String storeProfilePhoto(MultipartFile file, String employeeId) {
        validateFile(file);
        
        String safeName = UUID.randomUUID().toString() + ".jpg";
        Path target = uploadRoot.resolve(safeName);
        
        // Ensure target is within uploadRoot (prevent path traversal)
        if (!target.normalize().startsWith(uploadRoot.normalize())) {
            throw new SecurityException("Path traversal detected");
        }
        
        try {
            file.transferTo(target);
            SEC_LOG.info("SECURITY_EVENT: file_uploaded employee={} size={} type={}", 
                employeeId, file.getSize(), file.getContentType());
            return target.toString();
        } catch (IOException e) {
            throw new RuntimeException("File storage failed", e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new SecurityException("File exceeds maximum size of 5MB");
        }

        String originalName = file.getOriginalFilename();
        if (originalName != null) {
            String ext = originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase();
            if (BLOCKED_EXTENSIONS.contains(ext)) {
                SEC_LOG.warn("SECURITY_EVENT: blocked_file_extension ext={}", ext);
                throw new SecurityException("File type not allowed");
            }
        }

        // Magic bytes validation
        try {
            byte[] header = file.getInputStream().readNBytes(4);
            String magic = bytesToHex(header).toUpperCase();
            boolean valid = ALLOWED_MAGIC_BYTES.stream().anyMatch(magic::startsWith);
            if (!valid) {
                SEC_LOG.warn("SECURITY_EVENT: invalid_file_magic magic={}", magic);
                throw new SecurityException("Invalid file content");
            }
        } catch (IOException e) {
            throw new SecurityException("File validation failed");
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02X", b));
        }
        return sb.toString();
    }
}