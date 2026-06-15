"""
/ai-services/nlp_assistant/main.py

Main NLP Assistant service for text understanding and generation tasks.
Provides interfaces for:
- Document summarization (payroll summaries, HR reports)
- Text classification (email routing, compliance categorization)  
- Content generation (offer letters, policy drafts)
- Q&A and employee assistance
"""

import logging
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

logger = logging.getLogger(__name__)


class SummarizationRequest(BaseModel):
    """Request model for text summarization"""
    text: str = Field(..., min_length=10, max_length=50000, description="Text to summarize")
    style: str = Field(default="concise", description="executive, concise, detailed")
    max_length: int = Field(default=500, le=2000, description="Max output length")
    focus_areas: Optional[List[str]] = Field(default=None, description="Key areas to focus on")
    language: str = Field(default="en", description="Output language")


class ClassificationRequest(BaseModel):
    """Request model for text classification"""
    text: str = Field(..., min_length=10, max_length=10000, description="Text to classify")
    categories: List[str] = Field(..., min_items=2, description="Possible categories")
    confidence_threshold: float = Field(default=0.7, ge=0.0, le=1.0)


class ContentGenerationRequest(BaseModel):
    """Request model for content generation"""
    template: str = Field(..., description="offer_letter, policy_draft, job_description")
    context: Dict[str, Any] = Field(..., description="Context variables for generation")
    style: str = Field(default="professional", description="professional, friendly, legal")
    language: str = Field(default="en")


class NLPAssistant:
    """
    Main NLP Assistant service.
    Handles all text-based AI operations for HR platform.
    """
    
    def __init__(self):
        """Initialize NLP assistant with configured LLM provider"""
        try:
            # Lazy import to handle optional dependencies
            from nlp_assistant.llm.provider_factory import LLMProviderFactory
            self.llm_provider = LLMProviderFactory.get_default_provider()
            logger.info("NLP Assistant initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize NLP Assistant: {str(e)}")
            raise
    
    async def summarize(self, request: SummarizationRequest) -> Dict[str, Any]:
        """
        Summarize text using configured LLM provider.
        
        Args:
            request: SummarizationRequest with text and parameters
            
        Returns:
            Dictionary with summarized text and metadata
        """
        try:
            # Build summarization prompt
            prompt = self._build_summarization_prompt(request)
            
            # Generate summary
            logger.info(f"Generating {request.style} summary of {len(request.text)} chars")
            summary = await self.llm_provider.complete(prompt)
            
            return {
                "status": "success",
                "summary": summary,
                "original_length": len(request.text),
                "summary_length": len(summary),
                "style": request.style,
                "timestamp": datetime.utcnow().isoformat(),
                "model": self.llm_provider.model,
            }
        except Exception as e:
            logger.error(f"Summarization error: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "context": "summarization"
            }
    
    async def classify(self, request: ClassificationRequest) -> Dict[str, Any]:
        """
        Classify text into provided categories.
        
        Args:
            request: ClassificationRequest with text and categories
            
        Returns:
            Dictionary with classification results and confidence scores
        """
        try:
            # Build classification prompt
            prompt = self._build_classification_prompt(request)
            
            # Generate classification
            logger.info(f"Classifying text into {len(request.categories)} categories")
            result = await self.llm_provider.complete(prompt)
            
            # Parse results
            classification = self._parse_classification_result(
                result, request.categories
            )
            
            return {
                "status": "success",
                "classification": classification,
                "timestamp": datetime.utcnow().isoformat(),
                "confidence": classification.get("confidence", 0),
                "model": self.llm_provider.model,
            }
        except Exception as e:
            logger.error(f"Classification error: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "context": "classification"
            }
    
    async def generate_content(self, request: ContentGenerationRequest) -> Dict[str, Any]:
        """
        Generate HR-related content (letters, policies, etc).
        
        Args:
            request: ContentGenerationRequest with template and context
            
        Returns:
            Dictionary with generated content
        """
        try:
            # Build generation prompt
            prompt = self._build_generation_prompt(request)
            
            # Generate content
            logger.info(f"Generating {request.template} in {request.style} style")
            generated = await self.llm_provider.complete(prompt)
            
            return {
                "status": "success",
                "content": generated,
                "template": request.template,
                "style": request.style,
                "timestamp": datetime.utcnow().isoformat(),
                "model": self.llm_provider.model,
            }
        except Exception as e:
            logger.error(f"Content generation error: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "context": "generation"
            }
    
    async def answer_question(self, question: str, context: Optional[str] = None) -> Dict[str, Any]:
        """
        Answer an HR-related question using context and knowledge.
        
        Args:
            question: Question to answer
            context: Optional context about company/employee
            
        Returns:
            Dictionary with answer and confidence
        """
        try:
            # Build Q&A prompt
            prompt = self._build_qa_prompt(question, context)
            
            # Generate answer
            logger.info(f"Answering question: {question[:100]}...")
            answer = await self.llm_provider.complete(prompt)
            
            return {
                "status": "success",
                "question": question,
                "answer": answer,
                "timestamp": datetime.utcnow().isoformat(),
                "model": self.llm_provider.model,
            }
        except Exception as e:
            logger.error(f"Q&A error: {str(e)}")
            return {
                "status": "error",
                "error": str(e),
                "context": "question_answering"
            }
    
    async def stream_summarize(self, request: SummarizationRequest):
        """
        Stream-based summarization for real-time response.
        
        Yields:
            Text chunks as they are generated
        """
        try:
            prompt = self._build_summarization_prompt(request)
            logger.info("Starting stream summarization")
            
            async for chunk in self.llm_provider.stream_complete(prompt):
                yield chunk
        except Exception as e:
            logger.error(f"Stream summarization error: {str(e)}")
            yield f"Error: {str(e)}"
    
    # Helper methods
    
    def _build_summarization_prompt(self, request: SummarizationRequest) -> str:
        """Build prompt for text summarization"""
        style_instructions = {
            "executive": "Provide a concise executive summary with key points only",
            "concise": "Provide a brief 2-3 sentence summary",
            "detailed": "Provide a comprehensive summary with all important details",
        }
        
        instruction = style_instructions.get(request.style, style_instructions["concise"])
        
        focus = ""
        if request.focus_areas:
            focus = f"\nFocus on these areas: {', '.join(request.focus_areas)}"
        
        return f"""
{instruction}

Maximum length: {request.max_length} characters
Output language: {request.language}
{focus}

Text to summarize:
{request.text}

Summary:
"""
    
    def _build_classification_prompt(self, request: ClassificationRequest) -> str:
        """Build prompt for text classification"""
        categories_str = "\n".join(f"- {cat}" for cat in request.categories)
        
        return f"""
Classify the following text into one of these categories:
{categories_str}

Respond in JSON format:
{{
    "category": "selected category",
    "confidence": 0.0 to 1.0,
    "reasoning": "brief explanation"
}}

Text to classify:
{request.text}

Classification:
"""
    
    def _build_generation_prompt(self, request: ContentGenerationRequest) -> str:
        """Build prompt for content generation"""
        templates = {
            "offer_letter": "Generate a professional job offer letter",
            "policy_draft": "Draft a company HR policy document",
            "job_description": "Create a detailed job description",
        }
        
        instruction = templates.get(request.template, "Generate HR content")
        
        context_str = "\n".join(
            f"- {k}: {v}" for k, v in request.context.items()
        )
        
        return f"""
{instruction}

Style: {request.style}
Language: {request.language}

Context:
{context_str}

Please generate the {request.template}:
"""
    
    def _build_qa_prompt(self, question: str, context: Optional[str] = None) -> str:
        """Build prompt for Q&A"""
        context_part = f"\nCompany context:\n{context}" if context else ""
        
        return f"""
You are an HR assistant for a company. Answer the following question clearly and helpfully.
{context_part}

Question: {question}

Answer:
"""
    
    def _parse_classification_result(
        self, result: str, categories: List[str]
    ) -> Dict[str, Any]:
        """Parse classification result from LLM response"""
        try:
            import json
            import re
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', result, re.DOTALL)
            if json_match:
                parsed = json.loads(json_match.group())
                return parsed
            
            # Fallback: check if any category is mentioned
            result_lower = result.lower()
            for category in categories:
                if category.lower() in result_lower:
                    return {
                        "category": category,
                        "confidence": 0.6,
                        "reasoning": "Heuristic match"
                    }
            
            return {
                "category": categories[0],
                "confidence": 0.3,
                "reasoning": "Default selection"
            }
        except Exception as e:
            logger.error(f"Failed to parse classification: {str(e)}")
            return {
                "category": categories[0],
                "confidence": 0.0,
                "reasoning": "Parse error"
            }


# Singleton instance
_instance: Optional[NLPAssistant] = None


def get_nlp_assistant() -> NLPAssistant:
    """Get or create NLP assistant singleton"""
    global _instance
    if _instance is None:
        _instance = NLPAssistant()
    return _instance
