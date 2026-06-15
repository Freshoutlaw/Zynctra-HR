"""
/ai-services/nlp_assistant/api/routes.py

FastAPI routes for NLP Assistant service.
Provides endpoints for text summarization, classification, content generation, and Q&A.
Includes streaming responses, request validation, and comprehensive error handling.
"""

import logging
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Request, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from datetime import datetime

from nlp_assistant.main import get_nlp_assistant, SummarizationRequest, ClassificationRequest, ContentGenerationRequest
from shared.metrics import track_request
from shared.error_handling import safe_error_handler, ValidationError, LLMError

logger = logging.getLogger(__name__)

router = APIRouter()


class StreamingRequest(BaseModel):
    """Base model for streaming requests"""
    stream: bool = Field(default=False, description="Enable streaming response")


class SummarizeRequest(SummarizationRequest, StreamingRequest):
    """Request model for summarization endpoint"""
    pass


class ClassifyRequest(ClassificationRequest, StreamingRequest):
    """Request model for classification endpoint"""
    pass


class GenerateContentRequest(ContentGenerationRequest, StreamingRequest):
    """Request model for content generation endpoint"""
    pass


class QARequest(BaseModel):
    """Request model for Q&A endpoint"""
    question: str = Field(..., min_length=5, max_length=2000, description="Question to answer")
    context: Optional[str] = Field(None, max_length=5000, description="Additional context")
    max_length: int = Field(default=1000, le=5000, description="Maximum response length")


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    timestamp: str
    llm_provider: Optional[str] = None


class APIResponse(BaseModel):
    """Generic API response wrapper"""
    status: str
    data: Optional[dict] = None
    error: Optional[str] = None
    timestamp: str


def get_tenant_id(request: Request) -> str:
    """Extract tenant ID from request context"""
    return getattr(request.state, "tenant_id", "default")


def get_request_id(request: Request) -> str:
    """Extract request ID from request context"""
    return getattr(request.state, "request_id", "unknown")


@router.get("/health", response_model=HealthResponse, tags=["Health"])
@track_request("nlp_health")
async def health_check(request: Request) -> HealthResponse:
    """
    Health check endpoint for NLP service.
    Verifies service is running and LLM provider is accessible.
    """
    try:
        nlp_assistant = get_nlp_assistant()
        
        return HealthResponse(
            status="UP",
            service="nlp-assistant",
            timestamp=datetime.utcnow().isoformat(),
            llm_provider=nlp_assistant.llm_provider.model,
        )
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=503, detail="Service unavailable")


@router.post("/summarize", response_model=APIResponse, tags=["NLP Operations"])
@track_request("nlp_summarize")
@safe_error_handler
async def summarize(
    request_data: SummarizeRequest,
    request: Request,
) -> APIResponse:
    """
    Summarize text using configured LLM.
    
    Supports multiple summarization styles:
    - executive: High-level summary with key points only
    - concise: Brief 2-3 sentence summary
    - detailed: Comprehensive summary with all important details
    
    Request body:
    - text: Text to summarize (10-50000 characters)
    - style: Summarization style (executive, concise, detailed)
    - max_length: Maximum output length (default: 500)
    - focus_areas: Optional areas to focus on
    - language: Output language (default: en)
    - stream: Enable streaming response (default: false)
    """
    try:
        tenant_id = get_tenant_id(request)
        request_id = get_request_id(request)
        
        logger.info(
            f"Summarization request: tenant={tenant_id}, request_id={request_id}, "
            f"style={request_data.style}, stream={request_data.stream}"
        )
        
        nlp_assistant = get_nlp_assistant()
        
        # Handle streaming
        if request_data.stream:
            # Remove streaming flag before passing to summarize
            nlp_request = SummarizationRequest(
                text=request_data.text,
                style=request_data.style,
                max_length=request_data.max_length,
                focus_areas=request_data.focus_areas,
                language=request_data.language,
            )
            
            async def stream_generator():
                async for chunk in nlp_assistant.stream_summarize(nlp_request):
                    yield chunk
            
            return StreamingResponse(
                stream_generator(),
                media_type="text/plain",
                headers={"X-Request-ID": request_id}
            )
        
        # Non-streaming response
        nlp_request = SummarizationRequest(
            text=request_data.text,
            style=request_data.style,
            max_length=request_data.max_length,
            focus_areas=request_data.focus_areas,
            language=request_data.language,
        )
        
        result = await nlp_assistant.summarize(nlp_request)
        
        if result.get("status") == "error":
            raise LLMError(result.get("error", "Summarization failed"))
        
        return APIResponse(
            status="success",
            data=result,
            timestamp=datetime.utcnow().isoformat(),
        )
    except Exception as e:
        logger.error(f"Summarization failed: {str(e)}", exc_info=True)
        raise


@router.post("/classify", response_model=APIResponse, tags=["NLP Operations"])
@track_request("nlp_classify")
@safe_error_handler
async def classify(
    request_data: ClassifyRequest,
    request: Request,
) -> APIResponse:
    """
    Classify text into provided categories.
    
    Request body:
    - text: Text to classify (10-10000 characters)
    - categories: List of possible categories (minimum 2)
    - confidence_threshold: Minimum confidence score (0.0-1.0)
    - stream: Enable streaming response (default: false)
    
    Returns:
    - category: Selected category
    - confidence: Confidence score (0.0-1.0)
    - reasoning: Brief explanation of classification
    """
    try:
        tenant_id = get_tenant_id(request)
        request_id = get_request_id(request)
        
        logger.info(
            f"Classification request: tenant={tenant_id}, request_id={request_id}, "
            f"categories={len(request_data.categories)}"
        )
        
        nlp_assistant = get_nlp_assistant()
        
        nlp_request = ClassificationRequest(
            text=request_data.text,
            categories=request_data.categories,
            confidence_threshold=request_data.confidence_threshold,
        )
        
        result = await nlp_assistant.classify(nlp_request)
        
        if result.get("status") == "error":
            raise LLMError(result.get("error", "Classification failed"))
        
        return APIResponse(
            status="success",
            data=result,
            timestamp=datetime.utcnow().isoformat(),
        )
    except Exception as e:
        logger.error(f"Classification failed: {str(e)}", exc_info=True)
        raise


@router.post("/generate", response_model=APIResponse, tags=["NLP Operations"])
@track_request("nlp_generate")
@safe_error_handler
async def generate_content(
    request_data: GenerateContentRequest,
    request: Request,
) -> APIResponse:
    """
    Generate HR-related content (letters, policies, job descriptions, etc).
    
    Supported templates:
    - offer_letter: Professional job offer letter
    - policy_draft: Company HR policy document
    - job_description: Detailed job description
    
    Request body:
    - template: Content template to use
    - context: Dictionary with template variables
    - style: Content style (professional, friendly, legal)
    - language: Output language (default: en)
    - stream: Enable streaming response (default: false)
    
    Example context for offer_letter:
    {
      "candidate_name": "John Smith",
      "position": "Senior Engineer",
      "department": "Engineering",
      "start_date": "2024-01-15",
      "salary": "$150,000"
    }
    """
    try:
        tenant_id = get_tenant_id(request)
        request_id = get_request_id(request)
        
        logger.info(
            f"Content generation request: tenant={tenant_id}, request_id={request_id}, "
            f"template={request_data.template}"
        )
        
        nlp_assistant = get_nlp_assistant()
        
        nlp_request = ContentGenerationRequest(
            template=request_data.template,
            context=request_data.context,
            style=request_data.style,
            language=request_data.language,
        )
        
        result = await nlp_assistant.generate_content(nlp_request)
        
        if result.get("status") == "error":
            raise LLMError(result.get("error", "Content generation failed"))
        
        return APIResponse(
            status="success",
            data=result,
            timestamp=datetime.utcnow().isoformat(),
        )
    except Exception as e:
        logger.error(f"Content generation failed: {str(e)}", exc_info=True)
        raise


@router.post("/qa", response_model=APIResponse, tags=["NLP Operations"])
@track_request("nlp_qa")
@safe_error_handler
async def answer_question(
    qa_request: QARequest,
    request: Request,
) -> APIResponse:
    """
    Answer HR-related questions using LLM.
    
    Request body:
    - question: Question to answer (5-2000 characters)
    - context: Optional context about company/employee (max 5000 characters)
    - max_length: Maximum response length (default: 1000)
    
    Returns:
    - question: Original question
    - answer: Generated answer
    - model: LLM model used
    - timestamp: Response timestamp
    """
    try:
        tenant_id = get_tenant_id(request)
        request_id = get_request_id(request)
        
        logger.info(
            f"Q&A request: tenant={tenant_id}, request_id={request_id}"
        )
        
        nlp_assistant = get_nlp_assistant()
        
        result = await nlp_assistant.answer_question(qa_request.question, qa_request.context)
        
        if result.get("status") == "error":
            raise LLMError(result.get("error", "Q&A failed"))
        
        return APIResponse(
            status="success",
            data=result,
            timestamp=datetime.utcnow().isoformat(),
        )
    except Exception as e:
        logger.error(f"Q&A failed: {str(e)}", exc_info=True)
        raise


@router.get("/models", response_model=APIResponse, tags=["Info"])
@track_request("nlp_models")
async def list_models(request: Request) -> APIResponse:
    """
    List available LLM models and providers.
    
    Returns information about configured LLM provider and model.
    """
    try:
        nlp_assistant = get_nlp_assistant()
        
        return APIResponse(
            status="success",
            data={
                "provider": nlp_assistant.llm_provider.config.provider.value,
                "model": nlp_assistant.llm_provider.model,
                "capabilities": [
                    "summarization",
                    "classification",
                    "content_generation",
                    "question_answering",
                ],
            },
            timestamp=datetime.utcnow().isoformat(),
        )
    except Exception as e:
        logger.error(f"Failed to list models: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list models")
