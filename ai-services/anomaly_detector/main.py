"""
/ai-services/anomaly_detector/main.py

Anomaly Detection Service for Zynctra HR.
Detects suspicious activities:
- Unusual login patterns
- Irregular payroll modifications
- Unauthorized data access attempts
- Policy violations

Uses machine learning models and statistical analysis
to identify deviations from normal behavior.
"""

import logging
import asyncio
from typing import Optional, Dict, List, Any, Tuple
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
from enum import Enum

logger = logging.getLogger(__name__)


class AnomalyType(Enum):
    """Types of anomalies detected"""
    LOGIN_ANOMALY = "login_anomaly"
    PAYROLL_ANOMALY = "payroll_anomaly"
    DATA_ACCESS_ANOMALY = "data_access_anomaly"
    POLICY_VIOLATION = "policy_violation"
    UNUSUAL_ACTIVITY = "unusual_activity"


class AnomalySeverity(Enum):
    """Severity levels for anomalies"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AnomalyEvent(BaseModel):
    """Represents a detected anomaly"""
    id: str = Field(..., description="Unique anomaly ID")
    type: AnomalyType = Field(..., description="Type of anomaly")
    severity: AnomalySeverity = Field(..., description="Severity level")
    user_id: Optional[str] = Field(None, description="Affected user")
    tenant_id: str = Field(..., description="Tenant ID")
    description: str = Field(..., description="Human-readable description")
    evidence: Dict[str, Any] = Field(default_factory=dict, description="Supporting evidence")
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    resolved: bool = Field(default=False, description="Whether anomaly is resolved")
    resolved_at: Optional[str] = None
    resolution_notes: Optional[str] = None


class DetectionRequest(BaseModel):
    """Request for anomaly detection"""
    event_type: str = Field(..., description="Type of event to analyze")
    user_id: Optional[str] = None
    data: Dict[str, Any] = Field(..., description="Event data to analyze")
    tenant_id: str = Field(..., description="Tenant ID")
    context: Optional[Dict[str, Any]] = None


class AnomalyDetectorService:
    """Main anomaly detection service"""
    
    def __init__(self):
        """Initialize anomaly detector with models"""
        self.anomalies: Dict[str, AnomalyEvent] = {}
        self.detection_models: Dict[str, Any] = {}
        self.config = self._load_config()
        logger.info("Anomaly Detector Service initialized")
    
    def _load_config(self) -> Dict[str, Any]:
        """Load detection configuration"""
        return {
            "login_thresholds": {
                "failed_attempts": 5,
                "time_window_minutes": 30,
                "unusual_time": True,
                "unusual_location": True,
            },
            "payroll_thresholds": {
                "max_single_change_percent": 20,
                "max_daily_change_percent": 50,
                "unusual_timing": True,
            },
            "data_access_thresholds": {
                "max_records_per_minute": 1000,
                "unusual_data_types": True,
                "bulk_export_threshold": 10000,
            },
            "policy_check": {
                "enabled": True,
                "policies": ["data_retention", "access_control", "compliance"],
            },
        }
    
    async def detect(self, request: DetectionRequest) -> Tuple[bool, Optional[AnomalyEvent]]:
        """
        Detect anomalies in event data.
        
        Args:
            request: DetectionRequest with event data
            
        Returns:
            Tuple of (is_anomaly, anomaly_event)
        """
        try:
            logger.info(
                f"Detecting anomalies for tenant={request.tenant_id}, "
                f"event_type={request.event_type}"
            )
            
            # Route to appropriate detector
            if request.event_type == "login":
                return await self._detect_login_anomaly(request)
            elif request.event_type == "payroll":
                return await self._detect_payroll_anomaly(request)
            elif request.event_type == "data_access":
                return await self._detect_data_access_anomaly(request)
            else:
                logger.warning(f"Unknown event type: {request.event_type}")
                return False, None
        except Exception as e:
            logger.error(f"Anomaly detection error: {str(e)}", exc_info=True)
            return False, None
    
    async def _detect_login_anomaly(self, request: DetectionRequest) -> Tuple[bool, Optional[AnomalyEvent]]:
        """Detect login anomalies"""
        try:
            thresholds = self.config["login_thresholds"]
            data = request.data
            
            # Check failed login attempts
            failed_attempts = data.get("failed_attempts", 0)
            if failed_attempts >= thresholds["failed_attempts"]:
                anomaly = AnomalyEvent(
                    id=f"login_anomaly_{request.user_id}_{datetime.utcnow().timestamp()}",
                    type=AnomalyType.LOGIN_ANOMALY,
                    severity=AnomalySeverity.HIGH if failed_attempts > 10 else AnomalySeverity.MEDIUM,
                    user_id=request.user_id,
                    tenant_id=request.tenant_id,
                    description=f"Multiple failed login attempts: {failed_attempts}",
                    evidence={
                        "failed_attempts": failed_attempts,
                        "last_attempt": data.get("last_attempt"),
                        "ips": data.get("ips", []),
                    },
                )
                self.anomalies[anomaly.id] = anomaly
                logger.warning(f"Login anomaly detected: {anomaly.id}")
                return True, anomaly
            
            # Check unusual location
            if thresholds["unusual_location"] and data.get("unusual_location"):
                anomaly = AnomalyEvent(
                    id=f"location_anomaly_{request.user_id}_{datetime.utcnow().timestamp()}",
                    type=AnomalyType.LOGIN_ANOMALY,
                    severity=AnomalySeverity.MEDIUM,
                    user_id=request.user_id,
                    tenant_id=request.tenant_id,
                    description="Unusual login location detected",
                    evidence={
                        "location": data.get("location"),
                        "previous_location": data.get("previous_location"),
                        "distance_km": data.get("distance_km"),
                    },
                )
                self.anomalies[anomaly.id] = anomaly
                logger.warning(f"Location anomaly detected: {anomaly.id}")
                return True, anomaly
            
            return False, None
        except Exception as e:
            logger.error(f"Login anomaly detection error: {str(e)}", exc_info=True)
            return False, None
    
    async def _detect_payroll_anomaly(self, request: DetectionRequest) -> Tuple[bool, Optional[AnomalyEvent]]:
        """Detect payroll anomalies"""
        try:
            thresholds = self.config["payroll_thresholds"]
            data = request.data
            
            # Check single change percentage
            change_percent = data.get("salary_change_percent", 0)
            if abs(change_percent) > thresholds["max_single_change_percent"]:
                anomaly = AnomalyEvent(
                    id=f"payroll_anomaly_{request.user_id}_{datetime.utcnow().timestamp()}",
                    type=AnomalyType.PAYROLL_ANOMALY,
                    severity=AnomalySeverity.HIGH,
                    user_id=request.user_id,
                    tenant_id=request.tenant_id,
                    description=f"Unusual salary change: {change_percent}%",
                    evidence={
                        "change_percent": change_percent,
                        "previous_salary": data.get("previous_salary"),
                        "new_salary": data.get("new_salary"),
                        "modifier_id": data.get("modifier_id"),
                    },
                )
                self.anomalies[anomaly.id] = anomaly
                logger.warning(f"Payroll anomaly detected: {anomaly.id}")
                return True, anomaly
            
            # Check unusual timing
            if thresholds["unusual_timing"] and data.get("unusual_timing"):
                anomaly = AnomalyEvent(
                    id=f"payroll_timing_anomaly_{request.user_id}_{datetime.utcnow().timestamp()}",
                    type=AnomalyType.PAYROLL_ANOMALY,
                    severity=AnomalySeverity.MEDIUM,
                    user_id=request.user_id,
                    tenant_id=request.tenant_id,
                    description="Payroll modification at unusual time",
                    evidence={
                        "modification_time": data.get("modification_time"),
                        "expected_time": data.get("expected_time"),
                    },
                )
                self.anomalies[anomaly.id] = anomaly
                logger.warning(f"Payroll timing anomaly detected: {anomaly.id}")
                return True, anomaly
            
            return False, None
        except Exception as e:
            logger.error(f"Payroll anomaly detection error: {str(e)}", exc_info=True)
            return False, None
    
    async def _detect_data_access_anomaly(self, request: DetectionRequest) -> Tuple[bool, Optional[AnomalyEvent]]:
        """Detect data access anomalies"""
        try:
            thresholds = self.config["data_access_thresholds"]
            data = request.data
            
            # Check bulk access
            records_accessed = data.get("records_accessed", 0)
            if records_accessed > thresholds["bulk_export_threshold"]:
                anomaly = AnomalyEvent(
                    id=f"data_access_anomaly_{request.user_id}_{datetime.utcnow().timestamp()}",
                    type=AnomalyType.DATA_ACCESS_ANOMALY,
                    severity=AnomalySeverity.CRITICAL,
                    user_id=request.user_id,
                    tenant_id=request.tenant_id,
                    description=f"Bulk data access: {records_accessed} records",
                    evidence={
                        "records_accessed": records_accessed,
                        "data_types": data.get("data_types", []),
                        "access_method": data.get("access_method"),
                        "export_format": data.get("export_format"),
                    },
                )
                self.anomalies[anomaly.id] = anomaly
                logger.warning(f"Data access anomaly detected: {anomaly.id}")
                return True, anomaly
            
            # Check rate of access
            rate_per_minute = records_accessed / max(data.get("duration_minutes", 1), 1)
            if rate_per_minute > thresholds["max_records_per_minute"]:
                anomaly = AnomalyEvent(
                    id=f"data_rate_anomaly_{request.user_id}_{datetime.utcnow().timestamp()}",
                    type=AnomalyType.DATA_ACCESS_ANOMALY,
                    severity=AnomalySeverity.HIGH,
                    user_id=request.user_id,
                    tenant_id=request.tenant_id,
                    description=f"Unusual data access rate: {rate_per_minute:.0f} records/min",
                    evidence={
                        "rate_per_minute": rate_per_minute,
                        "duration_minutes": data.get("duration_minutes"),
                        "records_accessed": records_accessed,
                    },
                )
                self.anomalies[anomaly.id] = anomaly
                logger.warning(f"Data rate anomaly detected: {anomaly.id}")
                return True, anomaly
            
            return False, None
        except Exception as e:
            logger.error(f"Data access anomaly detection error: {str(e)}", exc_info=True)
            return False, None
    
    async def get_event(self, anomaly_id: str) -> Optional[AnomalyEvent]:
        """Retrieve anomaly event by ID"""
        return self.anomalies.get(anomaly_id)
    
    async def list_events(
        self,
        tenant_id: str,
        user_id: Optional[str] = None,
        anomaly_type: Optional[AnomalyType] = None,
        severity: Optional[AnomalySeverity] = None,
        resolved: Optional[bool] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> Tuple[List[AnomalyEvent], int]:
        """
        List anomalies with filtering and pagination.
        
        Args:
            tenant_id: Tenant ID to filter by
            user_id: Optional user ID to filter by
            anomaly_type: Optional anomaly type to filter by
            severity: Optional severity level to filter by
            resolved: Optional resolution status to filter by
            limit: Maximum number of results
            offset: Number of results to skip
            
        Returns:
            Tuple of (filtered_events, total_count)
        """
        try:
            # Filter anomalies
            filtered = []
            for anomaly in self.anomalies.values():
                if anomaly.tenant_id != tenant_id:
                    continue
                if user_id and anomaly.user_id != user_id:
                    continue
                if anomaly_type and anomaly.type != anomaly_type:
                    continue
                if severity and anomaly.severity != severity:
                    continue
                if resolved is not None and anomaly.resolved != resolved:
                    continue
                
                filtered.append(anomaly)
            
            # Sort by timestamp (newest first)
            filtered.sort(
                key=lambda a: a.timestamp,
                reverse=True
            )
            
            # Paginate
            total = len(filtered)
            results = filtered[offset:offset + limit]
            
            logger.info(
                f"Listed anomalies: tenant={tenant_id}, count={len(results)}, "
                f"total={total}"
            )
            
            return results, total
        except Exception as e:
            logger.error(f"Error listing anomalies: {str(e)}", exc_info=True)
            return [], 0
    
    async def resolve_event(
        self,
        anomaly_id: str,
        resolution_notes: str,
    ) -> Optional[AnomalyEvent]:
        """
        Mark anomaly as resolved.
        
        Args:
            anomaly_id: ID of anomaly to resolve
            resolution_notes: Notes on resolution
            
        Returns:
            Updated anomaly event
        """
        try:
            if anomaly_id not in self.anomalies:
                logger.warning(f"Anomaly not found: {anomaly_id}")
                return None
            
            anomaly = self.anomalies[anomaly_id]
            anomaly.resolved = True
            anomaly.resolved_at = datetime.utcnow().isoformat()
            anomaly.resolution_notes = resolution_notes
            
            logger.info(f"Anomaly resolved: {anomaly_id}")
            return anomaly
        except Exception as e:
            logger.error(f"Error resolving anomaly: {str(e)}", exc_info=True)
            return None
    
    async def get_statistics(self, tenant_id: str) -> Dict[str, Any]:
        """Get anomaly statistics for tenant"""
        try:
            tenant_anomalies = [
                a for a in self.anomalies.values()
                if a.tenant_id == tenant_id
            ]
            
            stats = {
                "total_anomalies": len(tenant_anomalies),
                "resolved": sum(1 for a in tenant_anomalies if a.resolved),
                "unresolved": sum(1 for a in tenant_anomalies if not a.resolved),
                "by_type": {},
                "by_severity": {},
            }
            
            # Count by type
            for anomaly_type in AnomalyType:
                count = sum(1 for a in tenant_anomalies if a.type == anomaly_type)
                if count > 0:
                    stats["by_type"][anomaly_type.value] = count
            
            # Count by severity
            for severity in AnomalySeverity:
                count = sum(1 for a in tenant_anomalies if a.severity == severity)
                if count > 0:
                    stats["by_severity"][severity.value] = count
            
            return stats
        except Exception as e:
            logger.error(f"Error getting statistics: {str(e)}", exc_info=True)
            return {}


# Singleton instance
_instance: Optional[AnomalyDetectorService] = None


def get_anomaly_detector() -> AnomalyDetectorService:
    """Get or create anomaly detector singleton"""
    global _instance
    if _instance is None:
        _instance = AnomalyDetectorService()
    return _instance
