"""
Authentication Middleware
"""
from fastapi import HTTPException, Security, status
from fastapi.security import APIKeyHeader
from config import settings

# API密钥认证
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def verify_api_key(api_key: str = Security(api_key_header)) -> str:
    """
    Verify API key

    Args:
        api_key: API key from header

    Returns:
        API key if valid

    Raises:
        HTTPException: If API key is invalid
    """
    if not settings.api_key:
        # 如果未配置API密钥，跳过验证（仅开发环境）
        if settings.debug:
            return "debug"
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API key not configured"
        )

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key is required",
            headers={"WWW-Authenticate": "ApiKey"},
        )

    if api_key != settings.api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid API key",
        )

    return api_key
