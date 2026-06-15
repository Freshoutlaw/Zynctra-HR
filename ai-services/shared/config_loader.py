"""
/ai-services/shared/config_loader.py

Configuration loader for Zynctra AI Services.
Loads and validates environment configuration for:
- LLM providers and models
- Database connections
- Logging levels
- Security settings
- Multi-tenant support
"""

import os
import logging
from typing import Optional, Dict, Any
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)


class Environment(Enum):
    """Supported environments"""
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class LogLevel(Enum):
    """Logging levels"""
    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


@dataclass
class DatabaseConfig:
    """Database configuration"""
    host: str
    port: int
    username: str
    password: str
    database: str
    pool_size: int = 10
    max_overflow: int = 20
    pool_timeout: int = 30
    pool_recycle: int = 3600

    @property
    def connection_string(self) -> str:
        """Build database connection string"""
        return (
            f"postgresql://{self.username}:{self.password}@"
            f"{self.host}:{self.port}/{self.database}"
        )


@dataclass
class LLMConfig:
    """LLM provider configuration"""
    provider: str
    model: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    temperature: float = 0.7
    max_tokens: int = 2048
    top_p: float = 0.9
    timeout: int = 30


@dataclass
class SecurityConfig:
    """Security settings"""
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expiration_hours: int = 24
    enable_rate_limiting: bool = True
    rate_limit_requests: int = 1000
    rate_limit_window_seconds: int = 3600
    cors_origins: list = None
    enable_https: bool = True
    require_tenant_header: bool = True

    def __post_init__(self):
        """Validate security configuration"""
        if not self.jwt_secret or len(self.jwt_secret) < 32:
            raise ValueError("JWT_SECRET must be at least 32 characters long")
        if self.cors_origins is None:
            self.cors_origins = ["http://localhost:3000"]


@dataclass
class LoggingConfig:
    """Logging configuration"""
    level: LogLevel
    format: str = "json"  # json or text
    output: str = "stdout"  # stdout or file
    log_file: Optional[str] = None
    enable_request_logging: bool = True
    enable_response_logging: bool = True


@dataclass
class AppConfig:
    """Main application configuration"""
    environment: Environment
    debug: bool
    port: int
    host: str
    database: DatabaseConfig
    llm: LLMConfig
    security: SecurityConfig
    logging: LoggingConfig
    backend_url: str
    analytics_enabled: bool = True
    anomaly_detection_enabled: bool = True


def load_config() -> AppConfig:
    """
    Load and validate application configuration from environment variables.
    
    Returns:
        Validated AppConfig instance
        
    Raises:
        ValueError: If required configuration is missing or invalid
    """
    
    # Environment
    env_str = os.getenv("ENVIRONMENT", "development").lower()
    try:
        environment = Environment[env_str.upper()]
    except KeyError:
        raise ValueError(f"Invalid ENVIRONMENT: {env_str}")
    
    debug = environment == Environment.DEVELOPMENT
    
    # Database configuration
    database = DatabaseConfig(
        host=os.getenv("DB_HOST", "localhost"),
        port=int(os.getenv("DB_PORT", "5432")),
        username=os.getenv("DB_USERNAME", "postgres"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME", "zynctra"),
        pool_size=int(os.getenv("DB_POOL_SIZE", "10")),
        max_overflow=int(os.getenv("DB_MAX_OVERFLOW", "20")),
        pool_timeout=int(os.getenv("DB_POOL_TIMEOUT", "30")),
    )
    
    # LLM configuration
    llm_provider = os.getenv("LLM_PROVIDER", "groq").lower()
    llm_model_map = {
        "groq": os.getenv("GROQ_MODEL", "mixtral-8x7b-32768"),
        "openai": os.getenv("OPENAI_MODEL", "gpt-4"),
        "anthropic": os.getenv("ANTHROPIC_MODEL", "claude-3-opus-20240229"),
        "ollama": os.getenv("OLLAMA_MODEL", "llama2"),
    }
    
    if llm_provider not in llm_model_map:
        raise ValueError(f"Unknown LLM_PROVIDER: {llm_provider}")
    
    llm_api_key_map = {
        "groq": os.getenv("GROQ_API_KEY"),
        "openai": os.getenv("OPENAI_API_KEY"),
        "anthropic": os.getenv("ANTHROPIC_API_KEY"),
        "ollama": None,
    }
    
    # Validate API keys for cloud providers
    if llm_provider != "ollama" and not llm_api_key_map[llm_provider]:
        raise ValueError(
            f"Missing API key for {llm_provider.upper()}: "
            f"Set {llm_provider.upper()}_API_KEY environment variable"
        )
    
    llm = LLMConfig(
        provider=llm_provider,
        model=llm_model_map[llm_provider],
        api_key=llm_api_key_map[llm_provider],
        base_url=os.getenv("LLM_BASE_URL"),
        temperature=float(os.getenv("LLM_TEMPERATURE", "0.7")),
        max_tokens=int(os.getenv("LLM_MAX_TOKENS", "2048")),
        top_p=float(os.getenv("LLM_TOP_P", "0.9")),
        timeout=int(os.getenv("LLM_TIMEOUT", "30")),
    )
    
    # Security configuration
    jwt_secret = os.getenv("JWT_SECRET")
    if not jwt_secret:
        if environment == Environment.PRODUCTION:
            raise ValueError("JWT_SECRET must be set in production")
        jwt_secret = "dev-secret-not-for-production-use-at-least-32-chars-long"
    
    security = SecurityConfig(
        jwt_secret=jwt_secret,
        jwt_algorithm=os.getenv("JWT_ALGORITHM", "HS256"),
        jwt_expiration_hours=int(os.getenv("JWT_EXPIRATION_HOURS", "24")),
        enable_rate_limiting=os.getenv("ENABLE_RATE_LIMITING", "true").lower() == "true",
        rate_limit_requests=int(os.getenv("RATE_LIMIT_REQUESTS", "1000")),
        rate_limit_window_seconds=int(os.getenv("RATE_LIMIT_WINDOW_SECONDS", "3600")),
        cors_origins=os.getenv(
            "CORS_ORIGINS", 
            "http://localhost:3000,http://localhost:8000"
        ).split(","),
        enable_https=os.getenv("ENABLE_HTTPS", "true").lower() == "true",
        require_tenant_header=os.getenv("REQUIRE_TENANT_HEADER", "true").lower() == "true",
    )
    
    # Logging configuration
    log_level_str = os.getenv("LOG_LEVEL", "INFO").upper()
    try:
        log_level = LogLevel[log_level_str]
    except KeyError:
        log_level = LogLevel.INFO
    
    logging_config = LoggingConfig(
        level=log_level,
        format=os.getenv("LOG_FORMAT", "json"),
        output=os.getenv("LOG_OUTPUT", "stdout"),
        log_file=os.getenv("LOG_FILE"),
        enable_request_logging=os.getenv("ENABLE_REQUEST_LOGGING", "true").lower() == "true",
        enable_response_logging=os.getenv("ENABLE_RESPONSE_LOGGING", "false").lower() == "true",
    )
    
    # Main application configuration
    app_config = AppConfig(
        environment=environment,
        debug=debug,
        port=int(os.getenv("AI_SERVICE_PORT", "8010")),
        host=os.getenv("AI_SERVICE_HOST", "0.0.0.0"),
        database=database,
        llm=llm,
        security=security,
        logging=logging_config,
        backend_url=os.getenv("BACKEND_URL", "http://localhost:8000"),
        analytics_enabled=os.getenv("ANALYTICS_ENABLED", "true").lower() == "true",
        anomaly_detection_enabled=os.getenv("ANOMALY_DETECTION_ENABLED", "true").lower() == "true",
    )
    
    logger.info(f"Configuration loaded for {environment.value} environment")
    logger.info(f"Using LLM provider: {llm.provider} (model: {llm.model})")
    
    return app_config


def get_config() -> AppConfig:
    """Get cached configuration instance"""
    if not hasattr(get_config, "_instance"):
        get_config._instance = load_config()
    return get_config._instance


def validate_config(config: AppConfig) -> bool:
    """
    Validate configuration completeness.
    
    Args:
        config: AppConfig instance to validate
        
    Returns:
        True if valid, False otherwise
    """
    try:
        # Check critical fields
        assert config.environment is not None, "Environment not set"
        assert config.llm.provider is not None, "LLM provider not set"
        assert config.security.jwt_secret is not None, "JWT secret not set"
        
        # Check database if enabled
        if config.environment == Environment.PRODUCTION:
            assert config.database.host, "Database host not configured"
            assert config.database.password, "Database password not set"
        
        logger.info("Configuration validation passed")
        return True
    except AssertionError as e:
        logger.error(f"Configuration validation failed: {str(e)}")
        return False
