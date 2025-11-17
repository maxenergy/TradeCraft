from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import time

app = FastAPI(title="E-commerce AI Service")

class ProductInfoRequest(BaseModel):
    product_name: str
    category: str
    features: List[str]
    target_languages: List[str]

@app.get("/")
def read_root() -> Dict[str, str]:
    return {"message": "AI Service is running"}

@app.post("/api/v1/generate-content")
async def generate_content(request: ProductInfoRequest) -> Dict[str, any]:
    """
    Mocks the AI content generation process.
    In a real application, this would call external LLMs (Wenxin, GLM-4, etc.)
    """
    print(f"Received request to generate content for: {request.product_name}")
    print(f"Target languages: {request.target_languages}")

    # Simulate the time taken for AI generation
    time.sleep(2)

    # Mocked response
    mocked_content = {}
    for lang in request.target_languages:
        mocked_content[lang] = {
            "title": f"Mock Title for {request.product_name} in {lang}",
            "description": f"This is a mocked, high-quality, engaging description for {request.product_name}, tailored for the {lang} market.",
            "features": [f"Feature 1 in {lang}", f"Feature 2 in {lang}"] + request.features,
            "seoTitle": f"SEO Title for {request.product_name} | {lang}",
            "seoDescription": f"Buy the best {request.product_name} online. Great deals for {lang} speakers.",
            "keywords": [request.product_name, "mock keyword", lang]
        }

    print("Generated mocked content successfully.")
    return {"data": mocked_content}
