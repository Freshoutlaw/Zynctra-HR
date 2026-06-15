"""
/ai-services/shared/metrics.py

Prometheus metrics and monitoring for Zynctra AI Services.
Tracks request counts, latency, model performance, and system health.
"""

import logging
import time
from typing import Optional, Dict, Any
from functools import wraps
from enum import Enum
from datetime import datetime

logger = logging.getLogger(__name__)


class MetricType(Enum):
    """Metric types"""
    COUNTER = "counter"
    GAUGE = "gauge"
    HISTOGRAM = "histogram"
    SUMMARY = "summary"


class Metric:
    """Generic metric container"""
    
    def __init__(self, name: str, metric_type: MetricType, help_text: str = ""):
        self.name = name
        self.metric_type = metric_type
        self.help_text = help_text
        self.labels: Dict[str, int] = {}
        self.value = 0
    
    def increment(self, labels: Optional[Dict[str, str]] = None, amount: float = 1) -> None:
        """Increment counter"""
        if self.metric_type != MetricType.COUNTER:
            raise ValueError(f"Cannot increment {self.metric_type.value} metric")
        
        label_key = self._make_label_key(labels)
        self.labels[label_key] = self.labels.get(label_key, 0) + amount
        self.value += amount
    
    def set(self, value: float, labels: Optional[Dict[str, str]] = None) -> None:
        """Set gauge value"""
        if self.metric_type != MetricType.GAUGE:
            raise ValueError(f"Cannot set {self.metric_type.value} metric")
        
        label_key = self._make_label_key(labels)
        self.labels[label_key] = value
        self.value = value
    
    def observe(self, value: float, labels: Optional[Dict[str, str]] = None) -> None:
        """Observe histogram/summary value"""
        if self.metric_type not in (MetricType.HISTOGRAM, MetricType.SUMMARY):
            raise ValueError(f"Cannot observe {self.metric_type.value} metric")
        
        label_key = self._make_label_key(labels)
        if label_key not in self.labels:
            self.labels[label_key] = []
        
        if isinstance(self.labels[label_key], list):
            self.labels[label_key].append(value)
        else:
            self.labels[label_key] = [value]
    
    @staticmethod
    def _make_label_key(labels: Optional[Dict[str, str]]) -> str:
        """Create label key from label dict"""
        if not labels:
            return "default"
        return "_".join(f"{k}={v}" for k, v in sorted(labels.items()))
    
    def get_prometheus_output(self) -> str:
        """Generate Prometheus format output"""
        lines = []
        lines.append(f"# HELP {self.name} {self.help_text}")
        lines.append(f"# TYPE {self.name} {self.metric_type.value}")
        
        for label_key, value in self.labels.items():
            if label_key == "default":
                if isinstance(value, list):
                    lines.append(f"{self.name} {len(value)}")
                else:
                    lines.append(f"{self.name} {value}")
            else:
                labels_str = "{" + label_key.replace("=", '="').replace("_", '","') + '"}'
                if isinstance(value, list):
                    lines.append(f"{self.name}{labels_str} {len(value)}")
                else:
                    lines.append(f"{self.name}{labels_str} {value}")
        
        return "\n".join(lines)


class MetricsRegistry:
    """Registry for all application metrics"""
    
    def __init__(self):
        self.metrics: Dict[str, Metric] = {}
    
    def register(self, name: str, metric_type: MetricType, help_text: str = "") -> Metric:
        """Register a new metric"""
        if name in self.metrics:
            logger.warning(f"Metric {name} already registered")
            return self.metrics[name]
        
        metric = Metric(name, metric_type, help_text)
        self.metrics[name] = metric
        return metric
    
    def get_metric(self, name: str) -> Optional[Metric]:
        """Get registered metric"""
        return self.metrics.get(name)
    
    def get_prometheus_output(self) -> str:
        """Generate all metrics in Prometheus format"""
        lines = []
        for metric in self.metrics.values():
            lines.append(metric.get_prometheus_output())
        return "\n".join(lines)


# Global metrics registry
_registry = MetricsRegistry()


def init_metrics() -> MetricsRegistry:
    """Initialize application metrics"""
    
    # Request metrics
    _registry.register(
        "ai_service_requests_total",
        MetricType.COUNTER,
        "Total number of API requests"
    )
    _registry.register(
        "ai_service_request_duration_ms",
        MetricType.HISTOGRAM,
        "Request duration in milliseconds"
    )
    _registry.register(
        "ai_service_requests_in_progress",
        MetricType.GAUGE,
        "Number of requests currently being processed"
    )
    
    # Endpoint metrics
    _registry.register(
        "ai_service_endpoint_requests_total",
        MetricType.COUNTER,
        "Request count by endpoint"
    )
    _registry.register(
        "ai_service_endpoint_errors_total",
        MetricType.COUNTER,
        "Error count by endpoint"
    )
    _registry.register(
        "ai_service_endpoint_latency_ms",
        MetricType.HISTOGRAM,
        "Endpoint latency in milliseconds"
    )
    
    # LLM metrics
    _registry.register(
        "ai_service_llm_requests_total",
        MetricType.COUNTER,
        "Total LLM API requests"
    )
    _registry.register(
        "ai_service_llm_errors_total",
        MetricType.COUNTER,
        "LLM API errors"
    )
    _registry.register(
        "ai_service_llm_latency_ms",
        MetricType.HISTOGRAM,
        "LLM response latency"
    )
    _registry.register(
        "ai_service_llm_tokens_total",
        MetricType.COUNTER,
        "Total tokens consumed from LLM"
    )
    
    # Anomaly detection metrics
    _registry.register(
        "ai_service_anomalies_detected_total",
        MetricType.COUNTER,
        "Total anomalies detected"
    )
    _registry.register(
        "ai_service_anomaly_detection_latency_ms",
        MetricType.HISTOGRAM,
        "Anomaly detection latency"
    )
    
    # Analytics metrics
    _registry.register(
        "ai_service_predictions_total",
        MetricType.COUNTER,
        "Total predictions generated"
    )
    _registry.register(
        "ai_service_prediction_latency_ms",
        MetricType.HISTOGRAM,
        "Prediction latency"
    )
    
    # System metrics
    _registry.register(
        "ai_service_cache_hits_total",
        MetricType.COUNTER,
        "Cache hits"
    )
    _registry.register(
        "ai_service_cache_misses_total",
        MetricType.COUNTER,
        "Cache misses"
    )
    _registry.register(
        "ai_service_errors_total",
        MetricType.COUNTER,
        "Total errors by type"
    )
    
    logger.info("Metrics initialized")
    return _registry


def get_registry() -> MetricsRegistry:
    """Get metrics registry"""
    return _registry


def track_request(endpoint: str):
    """
    Decorator to track request metrics.
    
    Args:
        endpoint: Endpoint name for labeling
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            
            # Increment in-progress counter
            registry = get_registry()
            in_progress_metric = registry.get_metric("ai_service_requests_in_progress")
            if in_progress_metric:
                in_progress_metric.set(
                    in_progress_metric.value + 1,
                    {"endpoint": endpoint}
                )
            
            try:
                # Increment total requests
                total_metric = registry.get_metric("ai_service_requests_total")
                if total_metric:
                    total_metric.increment({"endpoint": endpoint})
                
                # Execute function
                result = await func(*args, **kwargs)
                
                # Record success
                endpoint_metric = registry.get_metric("ai_service_endpoint_requests_total")
                if endpoint_metric:
                    endpoint_metric.increment({"endpoint": endpoint, "status": "success"})
                
                return result
            except Exception as e:
                # Record error
                error_metric = registry.get_metric("ai_service_endpoint_errors_total")
                if error_metric:
                    error_metric.increment({
                        "endpoint": endpoint,
                        "error_type": type(e).__name__
                    })
                raise
            finally:
                # Record latency and decrement in-progress
                duration_ms = (time.time() - start_time) * 1000
                
                latency_metric = registry.get_metric("ai_service_endpoint_latency_ms")
                if latency_metric:
                    latency_metric.observe(duration_ms, {"endpoint": endpoint})
                
                if in_progress_metric:
                    in_progress_metric.set(
                        max(0, in_progress_metric.value - 1),
                        {"endpoint": endpoint}
                    )
        
        return wrapper
    return decorator


def track_llm_call(provider: str):
    """
    Decorator to track LLM API calls.
    
    Args:
        provider: LLM provider name (groq, openai, etc.)
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            registry = get_registry()
            
            try:
                # Execute function
                result = await func(*args, **kwargs)
                
                # Record success
                total_metric = registry.get_metric("ai_service_llm_requests_total")
                if total_metric:
                    total_metric.increment({"provider": provider})
                
                return result
            except Exception as e:
                # Record error
                error_metric = registry.get_metric("ai_service_llm_errors_total")
                if error_metric:
                    error_metric.increment({
                        "provider": provider,
                        "error_type": type(e).__name__
                    })
                raise
            finally:
                # Record latency
                duration_ms = (time.time() - start_time) * 1000
                latency_metric = registry.get_metric("ai_service_llm_latency_ms")
                if latency_metric:
                    latency_metric.observe(duration_ms, {"provider": provider})
        
        return wrapper
    return decorator


def track_anomaly_detection():
    """Decorator to track anomaly detection metrics"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            registry = get_registry()
            
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                duration_ms = (time.time() - start_time) * 1000
                latency_metric = registry.get_metric("ai_service_anomaly_detection_latency_ms")
                if latency_metric:
                    latency_metric.observe(duration_ms)
        
        return wrapper
    return decorator


def track_prediction():
    """Decorator to track prediction metrics"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            registry = get_registry()
            
            # Increment prediction counter
            pred_metric = registry.get_metric("ai_service_predictions_total")
            if pred_metric:
                pred_metric.increment()
            
            try:
                result = await func(*args, **kwargs)
                return result
            finally:
                duration_ms = (time.time() - start_time) * 1000
                latency_metric = registry.get_metric("ai_service_prediction_latency_ms")
                if latency_metric:
                    latency_metric.observe(duration_ms)
        
        return wrapper
    return decorator
