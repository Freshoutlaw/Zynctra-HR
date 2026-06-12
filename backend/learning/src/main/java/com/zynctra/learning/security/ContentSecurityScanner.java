package com.zynctra.learning.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Set;

@Component
public class ContentSecurityScanner {

    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    private static final long MAX_SCORM_SIZE = 100 * 1024 * 1024; // 100MB
    
    private static final Set<String> BLOCKED_EXTENSIONS = Set.of(
        "exe", "dll", "bat", "cmd", "sh", "jar", "war", "ear", "jsp", "php", 
        "asp", "aspx", "py", "rb", "pl", "cgi", "js", "html", "htm"
    );
    
    private static final Set<String> ALLOWED_MAGIC_BYTES = Set.of(
        "25504446",   // PDF
        "504B0304",   // ZIP (SCORM)
        "1F8B08",     // GZIP
        "00000020667479706D70", // MP4
        "52494646"    // RIFF (WEBM/AVI)
    );

    public ScanResult scanUpload(MultipartFile file, boolean isScorm) {
        String originalName = file.getOriginalFilename();
        String ext = originalName != null ? 
            originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase() : "";
        
        // Extension check
        if (BLOCKED_EXTENSIONS.contains(ext)) {
            SEC_LOG.warn("SECURITY_EVENT: blocked_file_extension ext={} name={}", ext, originalName);
            return ScanResult.failed("File type not allowed: " + ext);
        }

        // Size check
        long maxSize = isScorm ? MAX_SCORM_SIZE : MAX_FILE_SIZE;
        if (file.getSize() > maxSize) {
            return ScanResult.failed("File exceeds maximum size of " + (maxSize / 1024 / 1024) + "MB");
        }

        // Magic bytes check
        try {
            byte[] header = file.getInputStream().readNBytes(8);
            String magic = bytesToHex(header).toUpperCase();
            boolean valid = ALLOWED_MAGIC_BYTES.stream().anyMatch(magic::startsWith);
            if (!valid) {
                SEC_LOG.warn("SECURITY_EVENT: invalid_file_magic magic={} name={}", magic, originalName);
                return ScanResult.failed("Invalid file content detected");
            }
        } catch (IOException e) {
            return ScanResult.failed("File validation failed");
        }

        return ScanResult.passed();
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) sb.append(String.format("%02X", b));
        return sb.toString();
    }

    public record ScanResult(boolean passed, String reason) {
        static ScanResult passed() { return new ScanResult(true, null); }
        static ScanResult failed(String reason) { return new ScanResult(false, reason); }
    }
}