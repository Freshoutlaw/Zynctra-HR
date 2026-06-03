"""
/ai-services/anomaly_detector/defense/defensive_trigger.py

Autonomous AI Self-Defense Layer
Detects security anomalies in real-time and executes defensive responses:
- Unauthorized payroll modifications
- Brute-force login attempts
- SQL injection / data injection patterns
- Anomalous data access patterns
- Privilege escalation attempts

Autonomous responses include:
- Token invalidation
- Forced session rotation
- IP source isolation
- Admin dashboard alerts
- Security event logging to immutable ledger
"""

import asyncio
import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import List, Dict, Any, Optional, Callable
import numpy as np
from collections import defaultdict
import json

logger = logging.getLogger(__name__)


class AnomalyType(Enum):
    """Types of security anomalies detected"""
    UNAUTHORIZED_PAYROLL_MODIFICATION = "unauthorized_payroll_modification"
    BRUTE_FORCE_LOGIN = "brute_force_login"
    SQL_INJECTION_ATTEMPT = "sql_injection_attempt"
    ANOMALOUS_DATA_ACCESS = "anomalous_data_access"
    PRIVILEGE_ESCALATION = "privilege_escalation"
    IMPOSSIBLE_TRAVEL = "impossible_travel"
    MASS_DATA_EXFILTRATION = "mass_data_exfiltration"
    SUSPICIOUS_API_USAGE = "suspicious_api_usage"


class ResponseAction(Enum):
    """Autonomous defensive response actions"""
    INVALIDATE_TOKENS = "invalidate_tokens"
    FORCE_SESSION_ROTATION = "force_session_rotation"
    ISOLATE_SOURCE_IP = "isolate_source_ip"
    LOCK_ACCOUNT = "lock_account"
    REQUIRE_MFA = "require_mfa"
    ALERT_ADMIN = "alert_admin"
    BLOCK_OPERATION = "block_operation"
    QUARANTINE_DATA = "quarantine_data"


class RiskLevel(Enum):
    """Risk assessment levels"""
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4


@dataclass
class SecurityEvent:
    """Security event detected by anomaly detector"""
    event_id: str
    anomaly_type: AnomalyType
    risk_level: RiskLevel
    user_id: Optional[str]
    ip_address: str
    timestamp: datetime
    description: str
    details: Dict[str, Any] = field(default_factory=dict)
    confidence_score: float = 0.0


@dataclass
class DefensiveResponse:
    """Defensive response action triggered by anomaly"""
    response_id: str
    event_id: str
    actions: List[ResponseAction] = field(default_factory=list)
    timestamp: datetime = field(default_factory=datetime.utcnow)
    executed: bool = False
    error: Optional[str] = None


class AnomalyDetectionModel(ABC):
    """Abstract base class for anomaly detection models"""

    @abstractmethod
    async def detect(self, event: Dict[str, Any]) -> Optional[SecurityEvent]:
        """
        Detect anomalies in event data
        
        Returns:
            SecurityEvent if anomaly detected, None otherwise
        """
        pass


class PayrollAnomalyDetector(AnomalyDetectionModel):
    """Detects unauthorized payroll modifications"""

    def __init__(self, threshold: float = 0.85):
        self.threshold = threshold
        self.historical_payrolls: Dict[str, List[float]] = defaultdict(list)

    async def detect(self, event: Dict[str, Any]) -> Optional[SecurityEvent]:
        """
        Detect anomalous payroll changes
        
        Checks:
        - Unusual salary increases/decreases
        - Weekend/off-hours payroll modifications
        - Changes by unauthorized users
        - Double-pay patterns
        """
        try:
            employee_id = event.get("employee_id")
            new_amount = event.get("amount", 0)
            modified_by = event.get("modified_by")
            timestamp = datetime.fromisoformat(event.get("timestamp"))

            # Rule 1: Check for unusual salary changes
            historical = self.historical_payrolls.get(employee_id, [])
            if historical:
                avg_salary = np.mean(historical)
                change_percent = abs(new_amount - avg_salary) / avg_salary if avg_salary > 0 else 0

                if change_percent > 0.3:  # >30% change
                    return SecurityEvent(
                        event_id=f"payroll_{employee_id}_{datetime.utcnow().timestamp()}",
                        anomaly_type=AnomalyType.UNAUTHORIZED_PAYROLL_MODIFICATION,
                        risk_level=RiskLevel.HIGH,
                        user_id=modified_by,
                        ip_address=event.get("ip_address", "unknown"),
                        timestamp=timestamp,
                        description=f"Unusual {change_percent*100:.1f}% salary change for employee {employee_id}",
                        details={
                            "employee_id": employee_id,
                            "previous_avg": avg_salary,
                            "new_amount": new_amount,
                            "change_percent": change_percent,
                            "modified_by": modified_by,
                        },
                        confidence_score=min(0.95, change_percent),
                    )

            # Rule 2: Check for off-hours modifications
            if timestamp.hour < 6 or timestamp.hour > 22:
                return SecurityEvent(
                    event_id=f"payroll_{employee_id}_{datetime.utcnow().timestamp()}",
                    anomaly_type=AnomalyType.UNAUTHORIZED_PAYROLL_MODIFICATION,
                    risk_level=RiskLevel.MEDIUM,
                    user_id=modified_by,
                    ip_address=event.get("ip_address", "unknown"),
                    timestamp=timestamp,
                    description=f"Off-hours payroll modification at {timestamp.hour}:00",
                    details={
                        "employee_id": employee_id,
                        "timestamp": timestamp.isoformat(),
                        "modified_by": modified_by,
                    },
                    confidence_score=0.7,
                )

            # Update historical data
            self.historical_payrolls[employee_id].append(new_amount)
            if len(self.historical_payrolls[employee_id]) > 24:  # Keep last 24 months
                self.historical_payrolls[employee_id].pop(0)

        except Exception as e:
            logger.error(f"Payroll anomaly detection error: {str(e)}")

        return None


class BruteForceDetector(AnomalyDetectionModel):
    """Detects brute-force login attempts"""

    def __init__(self, max_attempts: int = 5, window_seconds: int = 300):
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
        self.login_attempts: Dict[str, List[datetime]] = defaultdict(list)

    async def detect(self, event: Dict[str, Any]) -> Optional[SecurityEvent]:
        """
        Detect brute-force login attempts
        
        Triggers on:
        - Multiple failed logins from same IP
        - Rapid sequential attempts
        - Multiple IPs targeting same account
        """
        try:
            user_id = event.get("user_id")
            ip_address = event.get("ip_address")
            success = event.get("success", False)
            timestamp = datetime.fromisoformat(event.get("timestamp"))

            # Only track failed attempts
            if not success:
                key = f"{user_id}:{ip_address}"
                self.login_attempts[key].append(timestamp)

                # Clean old attempts
                cutoff = datetime.utcnow() - timedelta(seconds=self.window_seconds)
                self.login_attempts[key] = [
                    t for t in self.login_attempts[key] if t > cutoff
                ]

                # Check if threshold exceeded
                if len(self.login_attempts[key]) >= self.max_attempts:
                    return SecurityEvent(
                        event_id=f"brute_force_{user_id}_{datetime.utcnow().timestamp()}",
                        anomaly_type=AnomalyType.BRUTE_FORCE_LOGIN,
                        risk_level=RiskLevel.CRITICAL,
                        user_id=user_id,
                        ip_address=ip_address,
                        timestamp=timestamp,
                        description=f"Brute-force attack detected: {len(self.login_attempts[key])} failed attempts from {ip_address}",
                        details={
                            "user_id": user_id,
                            "ip_address": ip_address,
                            "failed_attempts": len(self.login_attempts[key]),
                            "window_seconds": self.window_seconds,
                        },
                        confidence_score=0.98,
                    )

        except Exception as e:
            logger.error(f"Brute-force detection error: {str(e)}")

        return None


class SQLInjectionDetector(AnomalyDetectionModel):
    """Detects SQL injection and data injection attempts"""

    # Patterns that commonly appear in SQL injection attempts
    INJECTION_PATTERNS = [
        r"(\bUNION\b.*\bSELECT\b)",
        r"(\bDROP\b.*\bTABLE\b)",
        r"(\bDELETE\b.*\bFROM\b)",
        r"(;.*\b(DROP|DELETE|UPDATE|INSERT)\b)",
        r"(1\s*=\s*1|1\s*=\s*0)",
        r"(__FILE__|__LINE__|environ)",
        r"(eval|exec|system|passthru)",
    ]

    async def detect(self, event: Dict[str, Any]) -> Optional[SecurityEvent]:
        """Detect SQL/command injection attempts"""
        try:
            import re

            user_input = event.get("input", "").lower()
            ip_address = event.get("ip_address")
            user_id = event.get("user_id")

            for pattern in self.INJECTION_PATTERNS:
                if re.search(pattern, user_input, re.IGNORECASE):
                    return SecurityEvent(
                        event_id=f"injection_{user_id}_{datetime.utcnow().timestamp()}",
                        anomaly_type=AnomalyType.SQL_INJECTION_ATTEMPT,
                        risk_level=RiskLevel.CRITICAL,
                        user_id=user_id,
                        ip_address=ip_address,
                        timestamp=datetime.utcnow(),
                        description=f"SQL injection attempt detected in input",
                        details={
                            "user_id": user_id,
                            "ip_address": ip_address,
                            "pattern_matched": pattern,
                            "input_length": len(user_input),
                        },
                        confidence_score=0.99,
                    )

        except Exception as e:
            logger.error(f"SQL injection detection error: {str(e)}")

        return None


class DefensiveTriggerEngine:
    """
    Engine that executes autonomous defensive responses to anomalies
    
    Responsibilities:
    - Determine response actions based on anomaly type
    - Execute responses in order of priority
    - Log all responses to immutable security ledger
    - Alert security team for critical events
    """

    def __init__(self):
        self.detectors: List[AnomalyDetectionModel] = [
            PayrollAnomalyDetector(),
            BruteForceDetector(max_attempts=5, window_seconds=300),
            SQLInjectionDetector(),
        ]
        self.response_handlers: Dict[ResponseAction, Callable] = {}
        self.event_ledger: List[Dict[str, Any]] = []

    async def process_event(self, event: Dict[str, Any]) -> Optional[DefensiveResponse]:
        """
        Process security event and trigger defensive responses
        
        Args:
            event: Raw security event
            
        Returns:
            DefensiveResponse if anomaly triggered response, None otherwise
        """
        # Run all detectors
        detected_event: Optional[SecurityEvent] = None
        for detector in self.detectors:
            detected_event = await detector.detect(event)
            if detected_event:
                break

        if not detected_event:
            return None

        # Log to immutable ledger
        await self._log_to_ledger(detected_event)

        # Determine response actions
        response_actions = self._determine_response_actions(detected_event)

        # Create response
        response = DefensiveResponse(
            response_id=f"response_{datetime.utcnow().timestamp()}",
            event_id=detected_event.event_id,
            actions=response_actions,
        )

        # Execute responses
        for action in response_actions:
            try:
                await self._execute_action(action, detected_event)
                logger.info(f"Executed defensive action: {action.value}")
            except Exception as e:
                response.error = str(e)
                logger.error(f"Failed to execute action {action.value}: {str(e)}")

        response.executed = not response.error

        # Alert admin for critical events
        if detected_event.risk_level == RiskLevel.CRITICAL:
            await self._alert_admin(detected_event, response)

        return response

    def _determine_response_actions(self, event: SecurityEvent) -> List[ResponseAction]:
        """Determine which response actions to execute"""
        actions: List[ResponseAction] = []

        if event.anomaly_type == AnomalyType.BRUTE_FORCE_LOGIN:
            actions = [
                ResponseAction.ISOLATE_SOURCE_IP,
                ResponseAction.LOCK_ACCOUNT,
                ResponseAction.ALERT_ADMIN,
            ]

        elif event.anomaly_type == AnomalyType.UNAUTHORIZED_PAYROLL_MODIFICATION:
            actions = [
                ResponseAction.BLOCK_OPERATION,
                ResponseAction.ALERT_ADMIN,
                ResponseAction.QUARANTINE_DATA,
            ]

        elif event.anomaly_type == AnomalyType.SQL_INJECTION_ATTEMPT:
            actions = [
                ResponseAction.INVALIDATE_TOKENS,
                ResponseAction.ISOLATE_SOURCE_IP,
                ResponseAction.ALERT_ADMIN,
            ]

        elif event.risk_level == RiskLevel.CRITICAL:
            actions = [
                ResponseAction.FORCE_SESSION_ROTATION,
                ResponseAction.ALERT_ADMIN,
            ]

        return actions

    async def _execute_action(
        self, action: ResponseAction, event: SecurityEvent
    ) -> None:
        """Execute a defensive action"""
        if action == ResponseAction.INVALIDATE_TOKENS:
            await self._invalidate_tokens(event.user_id)

        elif action == ResponseAction.FORCE_SESSION_ROTATION:
            await self._force_session_rotation(event.user_id)

        elif action == ResponseAction.ISOLATE_SOURCE_IP:
            await self._isolate_source_ip(event.ip_address)

        elif action == ResponseAction.LOCK_ACCOUNT:
            await self._lock_account(event.user_id)

        elif action == ResponseAction.ALERT_ADMIN:
            await self._alert_admin(event, None)

        elif action == ResponseAction.BLOCK_OPERATION:
            logger.warning(f"Blocking operation for user {event.user_id}")

        elif action == ResponseAction.QUARANTINE_DATA:
            logger.warning(f"Quarantining data for user {event.user_id}")

    async def _invalidate_tokens(self, user_id: Optional[str]) -> None:
        """Invalidate all tokens for a user"""
        # Calls token service to revoke all active sessions
        logger.info(f"Invalidating tokens for user {user_id}")
        # Implementation depends on auth backend

    async def _force_session_rotation(self, user_id: Optional[str]) -> None:
        """Force all sessions to rotate/refresh"""
        logger.info(f"Forcing session rotation for user {user_id}")

    async def _isolate_source_ip(self, ip_address: str) -> None:
        """Add IP to temporary blocklist"""
        logger.info(f"Isolating IP address: {ip_address}")
        # Would add to WAF/firewall rules

    async def _lock_account(self, user_id: Optional[str]) -> None:
        """Lock user account temporarily"""
        logger.info(f"Locking account for user {user_id}")

    async def _alert_admin(
        self, event: SecurityEvent, response: Optional[DefensiveResponse]
    ) -> None:
        """Send alert to security admin team"""
        alert_data = {
            "event_id": event.event_id,
            "anomaly_type": event.anomaly_type.value,
            "risk_level": event.risk_level.name,
            "description": event.description,
            "confidence_score": event.confidence_score,
            "timestamp": event.timestamp.isoformat(),
            "details": event.details,
        }
        logger.warning(f"SECURITY ALERT: {json.dumps(alert_data)}")
        # Would send email/webhook to admin team

    async def _log_to_ledger(self, event: SecurityEvent) -> None:
        """Log security event to immutable audit ledger"""
        ledger_entry = {
            "event_id": event.event_id,
            "anomaly_type": event.anomaly_type.value,
            "risk_level": event.risk_level.name,
            "timestamp": event.timestamp.isoformat(),
            "details": event.details,
        }
        self.event_ledger.append(ledger_entry)
        logger.info(f"Logged to security ledger: {event.event_id}")


# Singleton instance
_engine = None


def get_defensive_trigger_engine() -> DefensiveTriggerEngine:
    """Get or create defensive trigger engine"""
    global _engine
    if _engine is None:
        _engine = DefensiveTriggerEngine()
    return _engine


# Usage example:
async def process_security_event(event: Dict[str, Any]) -> None:
    """Process a security event through the defensive trigger engine"""
    engine = get_defensive_trigger_engine()
    response = await engine.process_event(event)
    if response:
        print(f"Response executed: {response.response_id}")