package com.zynctra.connector.client;

import java.io.FileInputStream;
import java.net.http.HttpClient;
import java.security.KeyStore;

import javax.net.ssl.SSLContext;

import org.apache.hc.client5.http.config.RequestConfig;
import org.apache.hc.client5.http.impl.classic.HttpClientBuilder;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory;
import org.apache.hc.core5.ssl.SSLContextBuilder;
import org.apache.hc.core5.util.Timeout;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class SecureRestTemplateFactory {
    
    // Strict timeouts to prevent resource exhaustion
    private static final Timeout CONNECT_TIMEOUT = Timeout.ofSeconds(5);
    private static final Timeout RESPONSE_TIMEOUT = Timeout.ofSeconds(30);
    private static final int MAX_CONNECTIONS_PER_ROUTE = 10;
    private static final int MAX_TOTAL_CONNECTIONS = 50;

    public RestTemplate createSecureTemplate(String connectorType) {
        try {
            // Load trust store from environment-configured path
            String trustStorePath = System.getenv("TRUSTSTORE_PATH");
            String trustStorePassword = System.getenv("TRUSTSTORE_PASSWORD");
            
            SSLContext sslContext;
            if (trustStorePath != null && trustStorePassword != null) {
                KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
                try (FileInputStream fis = new FileInputStream(trustStorePath)) {
                    trustStore.load(fis, trustStorePassword.toCharArray());
                }
                sslContext = SSLContextBuilder.create()
                    .loadTrustMaterial(trustStore, null)
                    .build();
            } else {
                // Use system default trust store
                sslContext = SSLContextBuilder.create()
                    .loadTrustMaterial(null, (chain, authType) -> false) // STRICT: no blind trust
                    .build();
            }
            
            SSLConnectionSocketFactory sslSocketFactory = 
                new SSLConnectionSocketFactory(sslContext);
            
            PoolingHttpClientConnectionManager connectionManager = 
                new PoolingHttpClientConnectionManager();
            connectionManager.setMaxTotal(MAX_TOTAL_CONNECTIONS);
            connectionManager.setDefaultMaxPerRoute(MAX_CONNECTIONS_PER_ROUTE);
            
            RequestConfig requestConfig = RequestConfig.custom()
                .setConnectTimeout(CONNECT_TIMEOUT)
                .setResponseTimeout(RESPONSE_TIMEOUT)
                .build();
            
            HttpClient httpClient = HttpClientBuilder.create()
                .setConnectionManager(connectionManager)
                .setDefaultRequestConfig(requestConfig)
                .setSSLSocketFactory(sslSocketFactory)
                .disableRedirectHandling() // Prevent open redirects
                .disableCookieManagement() // Prevent cookie leakage between connectors
                .useSystemProperties()
                .build();
            
            HttpComponentsClientHttpRequestFactory factory = 
                new HttpComponentsClientHttpRequestFactory(httpClient);
            
            RestTemplate template = new RestTemplate(factory);
            
            // Add security interceptors
            template.getInterceptors().add(new RequestSigningInterceptor(connectorType));
            template.getInterceptors().add(new AuditLoggingInterceptor(connectorType));
            
            return template;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to create secure RestTemplate", e);
        }
    }
}