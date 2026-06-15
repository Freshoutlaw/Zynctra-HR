"""
/ai-services/shared/logging_config.py

Structured logging configuration for Zynctra AI Services.
Supports both JSON and text formatting for production and development.
Includes request/response logging and performance metrics tracking.
"""

import logging
import json
import sys
from typing import Optional, Any, Dict
from datetime import datetime
from pythonjsonlogger import jsonlogger

logger = logging.getLogger(__name__)


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    """Custom JSON formatter with additional fields"""
    
    def add_fields(self, log_record: Dict[str, Any], record: logging.LogRecord, message_dict: Dict[str, Any]) -> None:
        """Add custom fields to JSON log output"""
        super().add_fields(log_record, record, message_dict)
        
        log_record["timestamp"] = datetime.utcnow().isoformat()
        log_record["logger"] = record.name
        log_record["level"] = record.levelname
        
        # Add exception info if present
        if record.exc_info and not log_record.get("exc_info"):
            log_record["exc_info"] = self.formatException(record.exc_info)
        
        # Add request context if available
        if hasattr(record, "request_id"):
            log_record["request_id"] = record.request_id
        if hasattr(record, "tenant_id"):
            log_record["tenant_id"] = record.tenant_id
        if hasattr(record, "user_id"):
            log_record["user_id"] = record.user_id


class TextFormatter(logging.Formatter):
    """Simple text formatter for development"""
    
    def format(self, record: logging.LogRecord) -> str:
        """Format log record as human-readable text"""
        timestamp = datetime.fromtimestamp(record.created).isoformat()
        
        log_msg = (
            f"[{timestamp}] [{record.levelname}] "
            f"[{record.name}:{record.lineno}] {record.getMessage()}"
        )
        
        # Add exception info if present
        if record.exc_info:
            log_msg += "\n" + self.formatException(record.exc_info)
        
        return log_msg


class RequestContextFilter(logging.Filter):
    """Filter to inject request context into logs"""
    
    def filter(self, record: logging.LogRecord) -> bool:
        """Inject request context from thread-local or async context"""
        try:
            from starlette.context import get
            record.request_id = get("request_id", None)
            record.tenant_id = get("tenant_id", None)
            record.user_id = get("user_id", None)
        except (RuntimeError, KeyError):
            # Context not available (not in request scope)
            pass
        
        return True


def setup_logging(
    level: str = "INFO",
    format_type: str = "json",
    output: str = "stdout",
    log_file: Optional[str] = None,
) -> None:
    """
    Setup structured logging for the application.
    
    Args:
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        format_type: Log format ("json" or "text")
        output: Output destination ("stdout" or "file")
        log_file: Path to log file if output is "file"
    """
    
    # Get root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, level.upper()))
    
    # Remove existing handlers
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)
    
    # Create formatter based on format_type
    if format_type.lower() == "json":
        formatter = CustomJsonFormatter(
            fmt='%(timestamp)s %(logger)s %(level)s %(message)s'
        )
    else:
        formatter = TextFormatter()
    
    # Add request context filter
    context_filter = RequestContextFilter()
    
    # Setup handler based on output
    if output.lower() == "file" and log_file:
        handler = logging.FileHandler(log_file)
    else:
        handler = logging.StreamHandler(sys.stdout)
    
    handler.setFormatter(formatter)
    handler.addFilter(context_filter)
    root_logger.addHandler(handler)
    
    # Setup third-party loggers
    logging.getLogger("uvicorn").setLevel(logging.INFO)
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("fastapi").setLevel(logging.INFO)
    
    logger.info(
        f"Logging configured: level={level}, format={format_type}, output={output}"
    )


def get_logger(name: str) -> logging.LoggerAdapter:
    """
    Get a logger adapter for a module.
    
    Args:
        name: Logger name (typically __name__)
        
    Returns:
        LoggerAdapter with helper methods
    """
    base_logger = logging.getLogger(name)
    return logging.LoggerAdapter(base_logger, {})


class RequestLogger:
    """Helper class for logging HTTP requests and responses"""
    
    @staticmethod
    def log_request(
        method: str,
        path: str,
        headers: Dict[str, str],
        body: Optional[str] = None,
        request_id: Optional[str] = None,
        tenant_id: Optional[str] = None,
    ) -> None:
        """Log incoming HTTP request"""
        logger = logging.getLogger("access")
        
        log_data = {
            "type": "request",
            "method": method,
            "path": path,
            "request_id": request_id,
            "tenant_id": tenant_id,
        }
        
        logger.info(json.dumps(log_data))
    
    @staticmethod
    def log_response(
        status_code: int,
        duration_ms: float,
        response_size: int,
        request_id: Optional[str] = None,
        tenant_id: Optional[str] = None,
        error: Optional[str] = None,
    ) -> None:
        """Log HTTP response"""
        logger = logging.getLogger("access")
        
        log_data = {
            "type": "response",
            "status_code": status_code,
            "duration_ms": duration_ms,
            "response_size": response_size,
            "request_id": request_id,
            "tenant_id": tenant_id,
        }
        
        if error:
            log_data["error"] = error
        
        logger.info(json.dumps(log_data))


class PerformanceLogger:
    """Helper class for logging performance metrics"""
    
    @staticmethod
    def log_operation(
        operation_name: str,
        duration_ms: float,
        status: str = "success",
        metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Log operation performance"""
        logger = logging.getLogger("performance")
        
        log_data = {
            "operation": operation_name,
            "duration_ms": duration_ms,
            "status": status,
        }
        
        if metadata:
            log_data.update(metadata)
        
        logger.info(json.dumps(log_data))


# Configure python-json-logger if available
try:
    import pythonjsonlogger
except ImportError:
    # Fallback if not installed
    logger.warning(
        "python-json-logger not installed, JSON logging may not work optimally"
    )
