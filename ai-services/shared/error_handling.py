"""
/ai-services/shared/error_handling.py

Unified error handling and custom exception classes for Zynctra AI Services.
Provides retry logic, error response formatting, and logging utilities.
"""

import logging
import asyncio
from typing import Optional, Callable, Any, Type, Tuple
from functools import wraps
from datetime import datetime, timedelta
from enum import Enum
from fastapi import HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class ErrorCode(Enum):
    """Standard error codes"""
    INVALID_REQUEST = "INVALID_REQUEST"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    NOT_FOUND = "NOT_FOUND"
    CONFLICT = "CONFLICT"
    RATE_LIMITED = "RATE_LIMITED"
    SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
    INTERNAL_ERROR = "INTERNAL_ERROR"
    LLM_ERROR = "LLM_ERROR"
    ANOMALY_ERROR = "ANOMALY_ERROR"
    ANALYTICS_ERROR = "ANALYTICS_ERROR"
    DATABASE_ERROR = "DATABASE_ERROR"
    VALIDATION_ERROR = "VALIDATION_ERROR"


class ErrorResponse(BaseModel):
    """Standard error response format"""
    error_code: str
    message: str
    details: Optional[str] = None
    timestamp: str
    request_id: Optional[str] = None
    retry_after: Optional[int] = None


class ZynctraException(Exception):
    """Base exception class for Zynctra AI Services"""
    
    def __init__(
        self,
        message: str,
        error_code: ErrorCode = ErrorCode.INTERNAL_ERROR,
        status_code: int = 500,
        details: Optional[str] = None,
        retry_after: Optional[int] = None,
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details
        self.retry_after = retry_after
        self.timestamp = datetime.utcnow().isoformat()
        super().__init__(self.message)
    
    def to_response(self, request_id: Optional[str] = None) -> ErrorResponse:
        """Convert exception to error response"""
        return ErrorResponse(
            error_code=self.error_code.value,
            message=self.message,
            details=self.details,
            timestamp=self.timestamp,
            request_id=request_id,
            retry_after=self.retry_after,
        )


class ValidationError(ZynctraException):
    """Raised when input validation fails"""
    
    def __init__(self, message: str, details: Optional[str] = None):
        super().__init__(
            message=message,
            error_code=ErrorCode.VALIDATION_ERROR,
            status_code=400,
            details=details,
        )


class AuthenticationError(ZynctraException):
    """Raised when authentication fails"""
    
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(
            message=message,
            error_code=ErrorCode.UNAUTHORIZED,
            status_code=401,
        )


class AuthorizationError(ZynctraException):
    """Raised when authorization fails"""
    
    def __init__(self, message: str = "Access denied"):
        super().__init__(
            message=message,
            error_code=ErrorCode.FORBIDDEN,
            status_code=403,
        )


class NotFoundError(ZynctraException):
    """Raised when resource is not found"""
    
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            message=f"{resource} not found",
            error_code=ErrorCode.NOT_FOUND,
            status_code=404,
            details=f"Identifier: {identifier}",
        )


class LLMError(ZynctraException):
    """Raised when LLM operation fails"""
    
    def __init__(
        self,
        message: str = "LLM operation failed",
        details: Optional[str] = None,
        retry_after: Optional[int] = None,
    ):
        super().__init__(
            message=message,
            error_code=ErrorCode.LLM_ERROR,
            status_code=500,
            details=details,
            retry_after=retry_after,
        )


class AnomalyDetectionError(ZynctraException):
    """Raised when anomaly detection fails"""
    
    def __init__(self, message: str = "Anomaly detection failed", details: Optional[str] = None):
        super().__init__(
            message=message,
            error_code=ErrorCode.ANOMALY_ERROR,
            status_code=500,
            details=details,
        )


class AnalyticsError(ZynctraException):
    """Raised when analytics operation fails"""
    
    def __init__(self, message: str = "Analytics operation failed", details: Optional[str] = None):
        super().__init__(
            message=message,
            error_code=ErrorCode.ANALYTICS_ERROR,
            status_code=500,
            details=details,
        )


class DatabaseError(ZynctraException):
    """Raised when database operation fails"""
    
    def __init__(self, message: str = "Database error", details: Optional[str] = None):
        super().__init__(
            message=message,
            error_code=ErrorCode.DATABASE_ERROR,
            status_code=500,
            details=details,
        )


class RateLimitError(ZynctraException):
    """Raised when rate limit is exceeded"""
    
    def __init__(self, retry_after: int = 60):
        super().__init__(
            message="Rate limit exceeded",
            error_code=ErrorCode.RATE_LIMITED,
            status_code=429,
            retry_after=retry_after,
        )


class ServiceUnavailableError(ZynctraException):
    """Raised when service is unavailable"""
    
    def __init__(self, message: str = "Service temporarily unavailable", retry_after: int = 60):
        super().__init__(
            message=message,
            error_code=ErrorCode.SERVICE_UNAVAILABLE,
            status_code=503,
            retry_after=retry_after,
        )


def retry_with_backoff(
    max_attempts: int = 3,
    initial_delay: float = 1.0,
    backoff_factor: float = 2.0,
    max_delay: float = 60.0,
    exceptions: Tuple[Type[Exception], ...] = (Exception,),
) -> Callable:
    """
    Decorator for retrying async functions with exponential backoff.
    
    Args:
        max_attempts: Maximum number of retry attempts
        initial_delay: Initial delay in seconds
        backoff_factor: Multiplier for delay between retries
        max_delay: Maximum delay between retries
        exceptions: Tuple of exceptions to catch and retry on
    """
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(*args, **kwargs) -> Any:
            attempt = 0
            delay = initial_delay
            
            while attempt < max_attempts:
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    attempt += 1
                    if attempt >= max_attempts:
                        logger.error(
                            f"Function {func.__name__} failed after {max_attempts} attempts: {str(e)}"
                        )
                        raise
                    
                    # Calculate delay with jitter
                    actual_delay = min(delay, max_delay)
                    logger.warning(
                        f"Function {func.__name__} attempt {attempt}/{max_attempts} failed: {str(e)}. "
                        f"Retrying in {actual_delay}s..."
                    )
                    
                    await asyncio.sleep(actual_delay)
                    delay *= backoff_factor
        
        return wrapper
    return decorator


def safe_error_handler(func: Callable) -> Callable:
    """
    Decorator for safe error handling of async functions.
    Converts exceptions to appropriate ZynctraException types.
    
    Args:
        func: Async function to wrap
    """
    @wraps(func)
    async def wrapper(*args, **kwargs) -> Any:
        try:
            return await func(*args, **kwargs)
        except ZynctraException:
            raise
        except ValueError as e:
            logger.error(f"Validation error in {func.__name__}: {str(e)}")
            raise ValidationError(str(e))
        except KeyError as e:
            logger.error(f"Not found error in {func.__name__}: {str(e)}")
            raise NotFoundError("Resource", str(e))
        except Exception as e:
            logger.error(
                f"Unexpected error in {func.__name__}: {str(e)}",
                exc_info=True
            )
            raise ZynctraException(
                message="An unexpected error occurred",
                error_code=ErrorCode.INTERNAL_ERROR,
                status_code=500,
                details=str(e),
            )
    
    return wrapper


class CircuitBreaker:
    """
    Circuit breaker pattern for handling cascading failures.
    Prevents repeated calls to failing services.
    """
    
    class State(Enum):
        CLOSED = "closed"
        OPEN = "open"
        HALF_OPEN = "half_open"
    
    def __init__(
        self,
        failure_threshold: int = 5,
        success_threshold: int = 2,
        timeout: int = 60,
    ):
        self.failure_threshold = failure_threshold
        self.success_threshold = success_threshold
        self.timeout = timeout
        self.state = self.State.CLOSED
        self.failure_count = 0
        self.success_count = 0
        self.last_failure_time: Optional[datetime] = None
    
    def record_success(self) -> None:
        """Record successful call"""
        self.failure_count = 0
        
        if self.state == self.State.HALF_OPEN:
            self.success_count += 1
            if self.success_count >= self.success_threshold:
                self.state = self.State.CLOSED
                logger.info("Circuit breaker CLOSED")
    
    def record_failure(self) -> None:
        """Record failed call"""
        self.failure_count += 1
        self.last_failure_time = datetime.utcnow()
        
        if self.failure_count >= self.failure_threshold:
            self.state = self.State.OPEN
            logger.warning("Circuit breaker OPEN")
    
    def can_execute(self) -> bool:
        """Check if operation can be executed"""
        if self.state == self.State.CLOSED:
            return True
        
        if self.state == self.State.OPEN:
            if (
                self.last_failure_time and
                datetime.utcnow() - self.last_failure_time > timedelta(seconds=self.timeout)
            ):
                self.state = self.State.HALF_OPEN
                self.success_count = 0
                logger.info("Circuit breaker HALF_OPEN")
                return True
            return False
        
        return True
    
    async def execute(self, func: Callable, *args, **kwargs) -> Any:
        """Execute function with circuit breaker protection"""
        if not self.can_execute():
            raise ServiceUnavailableError(
                retry_after=self.timeout
            )
        
        try:
            result = await func(*args, **kwargs)
            self.record_success()
            return result
        except Exception as e:
            self.record_failure()
            raise


def format_error_response(
    error: Exception,
    request_id: Optional[str] = None,
) -> Tuple[int, ErrorResponse]:
    """
    Format any exception to HTTP response.
    
    Args:
        error: Exception to format
        request_id: Request ID for tracing
        
    Returns:
        Tuple of (status_code, error_response)
    """
    if isinstance(error, ZynctraException):
        return error.status_code, error.to_response(request_id)
    else:
        exception = ZynctraException(
            message="Internal server error",
            error_code=ErrorCode.INTERNAL_ERROR,
            status_code=500,
            details=str(error),
        )
        return exception.status_code, exception.to_response(request_id)
