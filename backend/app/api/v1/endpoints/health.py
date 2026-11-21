from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.config import get_settings

router = APIRouter(tags=["health"])


class HealthResponse(BaseModel):
    application_name: str = Field(alias="applicationName")
    status: Literal["healthy"]
    api_version: str = Field(alias="apiVersion")

    model_config = {"populate_by_name": True}


@router.get("/health", response_model=HealthResponse)
def get_health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(
        application_name=settings.app_name,
        status="healthy",
        api_version=settings.api_version,
    )
