package com.zynctra.connector.security;

import java.net.InetAddress;
import java.net.URI;
import java.net.UnknownHostException;
import java.util.List;
import java.util.Set;

import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class OutboundRequestValidator {
    
    private static final Logger SEC_LOG = LoggerFactory.getLogger("SECURITY_AUDIT");
    
    // Strict allow-list of external domains per connector type
    private static final java.util.Map<String, Set<String>> ALLOWED_DOMAINS = java.util.Map.of(
        "workday", Set.of("*.workday.com", "*.myworkday.com"),
        "slack", Set.of("slack.com", "*.slack.com"),
        "salesforce", Set.of("salesforce.com", "*.salesforce.com", "*.force.com"),
        "okta", Set.of("okta.com", "*.okta.com", "*.oktapreview.com"),
        "quickbooks", Set.of("quickbooks.api.intuit.com"),
        "webhook", Set.of() // Must be explicitly configured per-tenant
    );
    
    // Blocked internal IP ranges (prevent SSRF)
    private static final List<String> BLOCKED_IP_PATTERNS = List.of(
        "127.", "10.", "192.168.", "172.16.", "172.17.", "172.18.", 
        "172.19.", "172.20.", "172.21.", "172.22.", "172.23.", "172.24.",
        "172.25.", "172.26.", "172.27.", "172.28.", "172.29.", "172.30.", "172.31.",
        "169.254.", "0.", "255.", "::1", "fc00:", "fe80:"
    );
    
    public void validateOutboundUrl(String connectorType, String url) {
        if (url == null || url.isBlank()) {
            throw new SecurityException("URL cannot be empty");
        }
        
        try {
            URI uri = new URI(url);
            
            // 1. Scheme validation
            if (!uri.getScheme().equals("https")) {
                throw new SecurityException("Only HTTPS connections allowed");
            }
            
            // 2. Domain validation against allow-list
            String host = uri.getHost();
            if (host == null) {
                throw new SecurityException("Invalid URL: missing host");
            }
            
            Set<String> allowed = ALLOWED_DOMAINS.getOrDefault(connectorType, Set.of());
            if (!isDomainAllowed(host, allowed)) {
                SEC_LOG.error("SECURITY_EVENT: outbound_url_blocked connector={} host={}", 
                    connectorType, host);
                throw new SecurityException("Domain not in allow-list for connector: " + connectorType);
            }
            
            // 3. IP resolution check (prevent DNS rebinding / SSRF)
            validateIpNotInternal(host);
            
            // 4. Port validation
            int port = uri.getPort();
            if (port != -1 && port != 443) {
                throw new SecurityException("Non-standard ports not allowed");
            }
            
            SEC_LOG.info("SECURITY_EVENT: outbound_url_validated connector={} host={}", 
                connectorType, host);
                
        } catch (java.net.URISyntaxException e) {
            throw new SecurityException("Invalid URL format");
        }
    }
    
    private boolean isDomainAllowed(String host, Set<String> patterns) {
        String lowerHost = host.toLowerCase();
        for (String pattern : patterns) {
            if (pattern.startsWith("*.")) {
                String suffix = pattern.substring(2);
                if (lowerHost.endsWith(suffix)) return true;
            } else if (lowerHost.equals(pattern)) {
                return true;
            }
        }
        // For custom webhooks, tenant must explicitly configure allowed domains
        return false;
    }
    
    private void validateIpNotInternal(String host) {
        try {
            InetAddress[] addresses = InetAddress.getAllByName(host);
            for (InetAddress addr : addresses) {
                String ip = addr.getHostAddress();
                for (String blocked : BLOCKED_IP_PATTERNS) {
                    if (ip.startsWith(blocked)) {
                        SEC_LOG.error("SECURITY_EVENT: ssrf_attempt_blocked host={} resolved_ip={}", 
                            host, ip);
                        throw new SecurityException("Internal IP addresses are blocked");
                    }
                }
            }
        } catch (UnknownHostException e) {
            throw new SecurityException("Could not resolve host: " + host);
        }
    }
}