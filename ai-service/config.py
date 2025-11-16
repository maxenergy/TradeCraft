"""
AI Service Configuration
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application Settings"""

    # Application
    app_name: str = "TradeCraft AI Service"
    app_version: str = "1.0.0"
    debug: bool = False
    log_level: str = "INFO"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    workers: int = 4

    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379
    redis_password: str = ""
    redis_db: int = 0

    # Celery
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    # Wenxin (文心一言)
    wenxin_api_key: str = ""
    wenxin_secret_key: str = ""
    wenxin_model: str = "ERNIE-Bot-4"
    wenxin_timeout: int = 30

    # GLM-4
    glm_api_key: str = ""
    glm_model: str = "glm-4-flash"
    glm_timeout: int = 30

    # Azure Translator
    azure_translator_key: str = ""
    azure_translator_region: str = "eastasia"
    azure_translator_endpoint: str = "https://api.cognitive.microsofttranslator.com"

    # Content Generation
    max_description_length: int = 2000
    max_features_count: int = 10
    generation_temperature: float = 0.7
    max_concurrent_requests: int = 10

    # Cache
    cache_ttl: int = 3600
    cache_enabled: bool = True

    # Security
    api_key: str = ""
    cors_origins: str = "http://localhost:3000,http://localhost:8080"

    # Monitoring
    enable_metrics: bool = True
    metrics_port: int = 9090

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def redis_url(self) -> str:
        """Get Redis URL"""
        if self.redis_password:
            return f"redis://:{self.redis_password}@{self.redis_host}:{self.redis_port}/{self.redis_db}"
        return f"redis://{self.redis_host}:{self.redis_port}/{self.redis_db}"

    @property
    def cors_origins_list(self) -> list:
        """Get CORS origins as list"""
        return [origin.strip() for origin in self.cors_origins.split(",")]


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Global settings instance
settings = get_settings()
