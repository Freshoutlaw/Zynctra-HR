package com.zynctra.gateway.handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.reactive.error.ErrorWebExceptionHandler;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;

/**
 * Global Error Handler
 * 
 * Handles all unhandled exceptions in the API Gateway and returns
 * standardized JSON error responses.
 * 
 * Ensures that even unexpected errors produce consistent API responses
 * that the frontend can handle gracefully.
 */
@Component
@Order(-1) // High priority to catch errors before default handlers
public class GlobalErrorHandler implements ErrorWebExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalErrorHandler.class);

    @Override
    public Mono<Void> handle(ServerWebExchange exchange, Throwable ex) {
        ServerHttpResponse response = exchange.getResponse();
        String traceId = exchange.getRequest().getHeaders().getFirst("X-Request-ID");
        if (traceId == null) {
            traceId = UUID.randomUUID().toString();
        }

        // Determine appropriate status code and error details
        ErrorDetails errorDetails = resolveErrorDetails(ex);

        // Set response headers
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);
        response.setStatusCode(errorDetails.status);

        // Log the error
        logError(ex, traceId, errorDetails);

        // Build JSON error response
        String errorBody = buildErrorResponse(errorDetails, traceId);

        DataBuffer buffer = response.bufferFactory().wrap(errorBody.getBytes(StandardCharsets.UTF_8));
        return response.writeWith(Mono.just(buffer));
    }

    /**
     * Resolves error details from the exception type.
     */
    private ErrorDetails resolveErrorDetails(Throwable ex) {
        if (ex instanceof ResponseStatusException rse) {
            return new ErrorDetails(
                rse.getStatusCode(),
                "REQUEST_ERROR",
                rse.getReason() != null ? rse.getReason() : "Request processing failed"
            );
        }

        if (ex instanceof java.util.concurrent.TimeoutException) {
            return new ErrorDetails(
                HttpStatus.GATEWAY_TIMEOUT,
                "GATEWAY_TIMEOUT",
                "The upstream service did not respond in time"
            );
        }

        if (ex instanceof java.io.IOException) {
            return new ErrorDetails(
                HttpStatus.BAD_GATEWAY,
                "SERVICE_UNAVAILABLE",
                "Unable to connect to the upstream service"
            );
        }

        // Default: internal server error (don't leak details)
        return new ErrorDetails(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR",
            "An unexpected error occurred. Please try again later."
        );
    }

    /**
     * Logs the error with appropriate severity.
     */
    private void logError(Throwable ex, String traceId, ErrorDetails details) {
        String message = String.format("Error traceId=%s code=%s status=%d message=%s",
            traceId, details.code, details.status.value(), ex.getMessage());

        if (details.status.is5xxServerError()) {
            logger.error(message, ex);
        } else if (details.status.is4xxClientError()) {
            logger.warn(message);
        } else {
            logger.info(message);
        }
    }

    /**
     * Builds the standardized JSON error response body.
     */
    private String buildErrorResponse(ErrorDetails details, String traceId) {
        return String.format(
            "{\"success\":false," +
            "\"error\":{\"code\":\"%s\",\"message\":\"%s\",\"statusCode\":%d}," +
            "\"timestamp\":\"%s\"," +
            "\"traceId\":\"%s\"}",
            escapeJson(details.code),
            escapeJson(details.message),
            details.status.value(),
            Instant.now().toString(),
            traceId
        );
    }

    /**
     * Escapes special characters in JSON strings.
     */
    private String escapeJson(String input) {
        if (input == null) return "";
        return input
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\b", "\\b")
            .replace("\f", "\\f")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
    }

    /**
     * Internal record for error details.
     */
    private record ErrorDetails(HttpStatus status, String code, String message) {}
}