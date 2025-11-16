"""
TradeCraft AI Service - Main Application
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from config import settings
from middleware.auth import verify_api_key
from middleware.rate_limit import RateLimitMiddleware

# 创建FastAPI应用
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered content generation service for cross-border e-commerce",
    docs_url="/docs",
    redoc_url="/redoc",
)

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加Gzip压缩
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 添加限流中间件
app.add_middleware(RateLimitMiddleware, max_requests=100, window_seconds=60)


# 健康检查端点
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": settings.app_name,
        "version": settings.app_version,
    }


# 根端点
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.app_version,
        "docs": "/docs",
    }


# 内容生成端点示例
@app.post("/api/v1/generate/description")
async def generate_description(
    request: dict,
    api_key: str = Depends(verify_api_key)
):
    """
    Generate product description

    Request body:
    {
        "product_name": "iPhone 15",
        "category": "Electronics",
        "features": ["A17 chip", "48MP camera"],
        "language": "zh"  // zh, en, id
    }
    """
    try:
        # TODO: Implement actual content generation
        # This is a placeholder implementation

        product_name = request.get("product_name")
        language = request.get("language", "zh")

        if not product_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="product_name is required"
            )

        # Placeholder response
        return {
            "success": True,
            "data": {
                "description": f"This is a generated description for {product_name}",
                "language": language,
                "model": "ERNIE-Bot-4" if language == "zh" else "glm-4-flash",
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


@app.post("/api/v1/translate")
async def translate_text(
    request: dict,
    api_key: str = Depends(verify_api_key)
):
    """
    Translate text using Azure Translator

    Request body:
    {
        "text": "Hello world",
        "from_language": "en",
        "to_language": "id"  // id for Indonesian
    }
    """
    try:
        text = request.get("text")
        from_language = request.get("from_language", "auto")
        to_language = request.get("to_language")

        if not text or not to_language:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="text and to_language are required"
            )

        # TODO: Implement actual translation
        # Placeholder response
        return {
            "success": True,
            "data": {
                "translated_text": f"[Translated from {from_language} to {to_language}] {text}",
                "from_language": from_language,
                "to_language": to_language,
            }
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )


# 异常处理
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
            }
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": 500,
                "message": "Internal server error",
                "detail": str(exc) if settings.debug else None,
            }
        },
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        workers=settings.workers if not settings.debug else 1,
    )
