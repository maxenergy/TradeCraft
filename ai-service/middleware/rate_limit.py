"""
Rate Limiting Middleware
"""
import time
from typing import Dict
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from collections import defaultdict
import asyncio


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Simple in-memory rate limiting middleware
    For production, use Redis-based rate limiting
    """

    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = defaultdict(list)
        self.lock = asyncio.Lock()

    async def dispatch(self, request: Request, call_next):
        """Process request with rate limiting"""

        # 跳过健康检查端点
        if request.url.path in ["/health", "/", "/docs", "/redoc", "/openapi.json"]:
            return await call_next(request)

        # 获取客户端IP
        client_ip = request.client.host

        async with self.lock:
            current_time = time.time()

            # 清理过期请求
            self.requests[client_ip] = [
                req_time for req_time in self.requests[client_ip]
                if current_time - req_time < self.window_seconds
            ]

            # 检查请求数量
            if len(self.requests[client_ip]) >= self.max_requests:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Rate limit exceeded. Max {self.max_requests} requests per {self.window_seconds} seconds.",
                    headers={
                        "Retry-After": str(self.window_seconds),
                        "X-RateLimit-Limit": str(self.max_requests),
                        "X-RateLimit-Remaining": "0",
                    }
                )

            # 记录请求
            self.requests[client_ip].append(current_time)
            remaining = self.max_requests - len(self.requests[client_ip])

        # 处理请求
        response = await call_next(request)

        # 添加限流响应头
        response.headers["X-RateLimit-Limit"] = str(self.max_requests)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        response.headers["X-RateLimit-Reset"] = str(int(current_time + self.window_seconds))

        return response
