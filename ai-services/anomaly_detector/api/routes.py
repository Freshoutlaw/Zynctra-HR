"""
/ai-services/anomaly_detector/api/routes.py

FastAPI routes for Anomaly Detection service.
Provides endpoints for detecting, querying, and managing anomaly events.
Includes security event logging and real-time alert capabilities.
"""

import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Request, Query
from pydantic import BaseModel, Field
from datetime import datetime

from anomaly_detector.main import (
    get_anomaly_detector,
    DetectionRequest,
    AnomalyEvent,
    AnomalyType,
    AnomalySeverity,
)
from shared.metrics import track_request, track_anomaly_detection
from shared.error_handling import safe_error_handler, AnomalyDetectionError

logger = logging.getLogger(__name__)

router = APIRouter()


class DetectRequestBody(BaseModel):
    """Request body for anomaly detection"""
    event_type: str = Field(..., description="Type of event (login, payroll, data_access)")
    user_id: Optional[str] = Field(None, description="User ID")
    data: dict = Field(..., description="Event data to analyze")
    context: Optional[dict] = None


class ResolveAnomalyRequest(BaseModel):
    """Request to resolve an anomaly"""
    resolution_notes: str = Field(..., min_length=5, max_length=1000)


class AnomalyListResponse(BaseModel):
    """Response for anomaly list endpoint"""
    anomalies: List[AnomalyEvent]
    total_count: int
    limit: int
    offset: int


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    timestamp: str


class StatisticsResponse(BaseModel):
    """Anomaly statistics response"""
    total_anomalies: int
    resolved: int
    unresolved: int
    by_type: dict
    by_severity: dict
    timestamp: str


def get_tenant_id(request: Request) -> str:
    """Extract tenant ID from request context"""
    return getattr(request.state, "tenant_id", "default")


def get_request_id(request: Request) -> str:
    """Extract request ID from request context"""
    return getattr(request.state, "request_id", "unknown")


@router.get("/health", response_model=HealthResponse, tags=["Health"])
@track_request("anomaly_health")
async def health_check(request: Request) -> HealthResponse:
    """
    Health check endpoint for anomaly detection service.
    """
    try:
        return HealthResponse(
            status="UP",
            service="anomaly-detector",
            timestamp=datetime.utcnow().isoformat(),
        )
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unavailable")


@router.post("/detect", response_model=dict, tags=["Detection"])
@track_request("anomaly_detect")
@track_anomaly_detection()
@safe_error_handler
async def detect_anomaly(
    request_body: DetectRequestBody,
    request: Request,
) -> dict:
    """
    Detect anomalies in event data.
    
    Supported event types:
    - login: Suspicious login patterns
    - payroll: Unauthorized payroll modifications
    - data_access: Unusual data access patterns
    
    Request body:
    - event_type: Type of event to analyze
    - user_id: Optional user ID
    - data: Dictionary containing event data
    - context: Optional additional context
    
    Returns:
    - is_anomaly: Whether anomaly was detected
    - anomaly: AnomalyEvent if detected, null otherwise
    - confidence: Confidence score (0-1)
    """
    try:
        tenant_id = get_tenant_id(request)
        request_id = get_request_id(request)
        
        logger.info(
            f"Anomaly detection request: tenant={tenant_id}, request_id={request_id}, "
            f"event_type={request_body.event_type}"
        )
        
        detector = get_anomaly_detector()
        
        detection_request = DetectionRequest(
            event_type=request_body.event_type,
            user_id=request_body.user_id,
            data=request_body.data,
            tenant_id=tenant_id,
            context=request_body.context,
        )
        
        is_anomaly, anomaly_event = await detector.detect(detection_request)
        
        result = {
            "is_anomaly": is_anomaly,
            "anomaly": anomaly_event.dict() if anomaly_event else None,
            "confidence": 0.95 if is_anomaly else 0.05,
            "timestamp": datetime.utcnow().isoformat(),
            "request_id": request_id,
        }
        
        if is_anomaly:
            logger.warning(
                f"Anomaly detected: id={anomaly_event.id}, "
                f"type={anomaly_event.type.value}, "
                f"severity={anomaly_event.severity.value}"
            )
        
        return result
    except Exception as e:
        logger.error(f"Anomaly detection error: {str(e)}", exc_info=True)
        raise


@router.get("/events", response_model=AnomalyListResponse, tags=["Events"])
@track_request("anomaly_list_events")
@safe_error_handler
async def list_events(
    request: Request,
    user_id: Optional[str] = Query(None, description="Filter by user ID"),
    type: Optional[str] = Query(None, description="Filter by anomaly type"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    resolved: Optional[bool] = Query(None, description="Filter by resolution status"),
    limit: int = Query(50, ge=1, le=100, description="Results per page"),
    offset: int = Query(0, ge=0, description="Number of results to skip"),
) -> AnomalyListResponse:
    """
    List anomaly events with filtering and pagination.
    
    Query parameters:
    - user_id: Filter by user ID
    - type: Filter by anomaly type (login_anomaly, payroll_anomaly, data_access_anomaly, policy_violation, unusual_activity)
    - severity: Filter by severity (low, medium, high, critical)
    - resolved: Filter by resolution status (true/false)
    - limit: Results per page (1-100)
    - offset: Number of results to skip (pagination)
    
    Returns:
    - anomalies: List of AnomalyEvent objects
    - total_count: Total number of matching anomalies
    - limit: Requested limit
    - offset: Requested offset
    """
    try:
        tenant_id = get_tenant_id(request)
        request_id = get_request_id(request)
        
        logger.info(
            f"Listing anomalies: tenant={tenant_id}, request_id={request_id}, "
            f"user_id={user_id}, limit={limit}, offset={offset}"
        )
        
        detector = get_anomaly_detector()
        
        # Parse filters
        anomaly_type = None
        if type:
            try:
                anomaly_type = AnomalyType[type.upper()]
            except (KeyError, AttributeError):
                raise ValueError(f"Invalid anomaly type: {type}")
        
        severity_level = None
        if severity:
            try:
                severity_level = AnomalySeverity[severity.upper()]
            except (KeyError, AttributeError):
                raise ValueError(f"Invalid severity: {severity}")
        
        # Retrieve events
        anomalies, total_count = await detector.list_events(
            tenant_id=tenant_id,
            user_id=user_id,
            anomaly_type=anomaly_type,
            severity=severity_level,
            resolved=resolved,
            limit=limit,
            offset=offset,
        )
        
        return AnomalyListResponse(
            anomalies=anomalies,
            total_count=total_count,
            limit=limit,
            offset=offset,
        )
    except Exception as e:
        logger.error(f"Error listing anomalies: {str(e)}", exc_info=True)
        raise


@router.get("/events/{anomaly_id}", response_model=dict, tags=["Events"])
@track_request("anomaly_get_event")
@safe_error_handler
async def get_event(
    anomaly_id: str,
    request: Request,
) -> dict:
    """
    Retrieve a specific anomaly event by ID.
    
    Path parameters:
    - anomaly_id: Unique anomaly identifier
    
    Returns:
    - AnomalyEvent object with full details
    """
    try:
        tenant_id = get_tenant_id(request)
        request_id = get_request_id(request)
        
        logger.info(
            f"Getting anomaly: id={anomaly_id}, tenant={tenant_id}, "
            f"request_id={request_id}"
        )
        
        detector = get_anomaly_detector()
        anomaly = await detector.get_event(anomaly_id)
        
        if not anomaly:
            logger.warning(f"Anomaly not found: {anomaly_id}")
            raise HTTPException(status_code=404, detail="Anomaly not found")
        
        # Verify tenant access
        if anomaly.tenant_id != tenant_id:
            logger.warning(
                f"Unauthorized access attempt: anomaly_id={anomaly_id}, "
                f"tenant={tenant_id}, owner_tenant={anomaly.tenant_id}"
            )
            raise HTTPException(status_code=403, detail="Access denied")
        
        return {
            "anomaly": anomaly.dict(),
            "request_id": request_id,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting anomaly: {str(e)}", exc_info=True)
        raise


@router.post("/events/{anomaly_id}/resolve", response_model=dict, tags=["Events"])
@track_request("anomaly_resolve")
@safe_error_handler
async def resolve_event(
    anomaly_id: str,
    resolve_request: ResolveAnomalyRequest,
    request: Request,
) -> dict:
    """
    Mark an anomaly as resolved.
    
    Path parameters:
    - anomaly_id: Unique anomaly identifier
    
    Request body:
    - resolution_notes: Notes on how the anomaly was resolved (5-1000 characters)
    
    Returns:
    - Updated AnomalyEvent object
    """
    try:
        tenant_id = get_tenant_id(request)
        request_id = get_request_id(request)
        
        logger.info(
            f"Resolving anomaly: id={anomaly_id}, tenant={tenant_id}, "
            f"request_id={request_id}"
        )
        
        detector = get_anomaly_detector()
        
        # Get existing anomaly
        anomaly = await detector.get_event(anomaly_id)
        if not anomaly:
            logger.warning(f"Anomaly not found: {anomaly_id}")
            raise HTTPException(status_code=404, detail="Anomaly not found")
        
        # Verify tenant access
        if anomaly.tenant_id != tenant_id:
            logger.warning(
                f"Unauthorized access attempt: anomaly_id={anomaly_id}, "
                f"tenant={tenant_id}, owner_tenant={anomaly.tenant_id}"
            )
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Resolve anomaly
        resolved_anomaly = await detector.resolve_event(
            anomaly_id=anomaly_id,
            resolution_notes=resolve_request.resolution_notes,
        )
        
        logger.info(f"Anomaly resolved: {anomaly_id}")
        
        return {
            "anomaly": resolved_anomaly.dict() if resolved_anomaly else None,
            "request_id": request_id,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resolving anomaly: {str(e)}", exc_info=True)
        raise


@router.get("/statistics", response_model=StatisticsResponse, tags=["Analytics"])
@track_request("anomaly_statistics")
@safe_error_handler
async def get_statistics(request: Request) -> StatisticsResponse:
    """
    Get anomaly detection statistics for the tenant.
    
    Returns:
    - total_anomalies: Total number of detected anomalies
    - resolved: Number of resolved anomalies
    - unresolved: Number of unresolved anomalies
    - by_type: Breakdown by anomaly type
    - by_severity: Breakdown by severity level
    """
    try:
        tenant_id = get_tenant_id(request)
        request_id = get_request_id(request)
        
        logger.info(
            f"Getting anomaly statistics: tenant={tenant_id}, "
            f"request_id={request_id}"
        )
        
        detector = get_anomaly_detector()
        stats = await detector.get_statistics(tenant_id)
        
        return StatisticsResponse(
            total_anomalies=stats.get("total_anomalies", 0),
            resolved=stats.get("resolved", 0),
            unresolved=stats.get("unresolved", 0),
            by_type=stats.get("by_type", {}),
            by_severity=stats.get("by_severity", {}),
            timestamp=datetime.utcnow().isoformat(),
        )
    except Exception as e:
        logger.error(f"Error getting statistics: {str(e)}", exc_info=True)
        raise
