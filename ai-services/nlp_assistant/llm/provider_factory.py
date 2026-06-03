"""
/ai-services/nlp_assistant/llm/provider_factory.py

LLM Provider Factory Pattern
Enables seamless switching between Groq, OpenAI, Anthropic, Ollama, and local models
via runtime environment configuration without code changes.

This architecture allows Zynctra to:
1. Use Groq as primary provider (fastest, cost-effective)
2. Switch to OpenAI/Claude for specific use cases
3. Fall back to local models for sensitive/offline scenarios
4. Scale inference across multiple providers dynamically
"""

import os
import logging
from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from enum import Enum
from dataclasses import dataclass
import asyncio

logger = logging.getLogger(__name__)


class LLMProviderType(Enum):
    """Supported LLM providers"""
    GROQ = "groq"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    OLLAMA = "ollama"


@dataclass
class LLMConfig:
    """Configuration for LLM provider"""
    provider: LLMProviderType
    model: str
    api_key: Optional[str] = None
    base_url: Optional[str] = None
    temperature: float = 0.7
    max_tokens: int = 2048
    top_p: float = 0.9
    timeout: int = 30


class LLMProvider(ABC):
    """Abstract base class for LLM providers"""

    def __init__(self, config: LLMConfig):
        self.config = config
        self.model = config.model
        self.temperature = config.temperature
        self.max_tokens = config.max_tokens
        self.top_p = config.top_p
        self.timeout = config.timeout

    @abstractmethod
    async def complete(self, prompt: str, **kwargs) -> str:
        """
        Generate completion for given prompt
        
        Args:
            prompt: Input prompt
            **kwargs: Additional provider-specific parameters
            
        Returns:
            Generated text response
        """
        pass

    @abstractmethod
    async def stream_complete(self, prompt: str, **kwargs):
        """
        Stream completion response token by token
        
        Args:
            prompt: Input prompt
            **kwargs: Additional parameters
            
        Yields:
            Token chunks as they arrive
        """
        pass

    @abstractmethod
    def validate_connection(self) -> bool:
        """Validate provider connection and credentials"""
        pass


class GroqProvider(LLMProvider):
    """Groq API Provider - Fast inference, cost-effective"""

    def __init__(self, config: LLMConfig):
        super().__init__(config)
        
        if not config.api_key:
            raise ValueError("GROQ_API_KEY environment variable not set")
        
        try:
            from groq import Groq, AsyncGroq
            self.client = Groq(api_key=config.api_key)
            self.async_client = AsyncGroq(api_key=config.api_key)
        except ImportError:
            raise ImportError("Install groq: pip install groq")

        logger.info(f"Initialized Groq provider with model: {self.model}")

    async def complete(self, prompt: str, **kwargs) -> str:
        """Generate completion using Groq API"""
        try:
            message = await self.async_client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                top_p=self.top_p,
                timeout=self.timeout,
            )
            return message.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq completion error: {str(e)}")
            raise

    async def stream_complete(self, prompt: str, **kwargs):
        """Stream completions from Groq"""
        try:
            with self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                top_p=self.top_p,
                stream=True,
            ) as stream:
                for chunk in stream:
                    if chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content
        except Exception as e:
            logger.error(f"Groq streaming error: {str(e)}")
            raise

    def validate_connection(self) -> bool:
        """Test Groq connection"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": "test"}],
                max_tokens=10,
            )
            return bool(response.choices[0].message.content)
        except Exception as e:
            logger.error(f"Groq connection validation failed: {str(e)}")
            return False


class OpenAIProvider(LLMProvider):
    """OpenAI API Provider"""

    def __init__(self, config: LLMConfig):
        super().__init__(config)
        
        if not config.api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set")
        
        try:
            from openai import AsyncOpenAI
            self.client = AsyncOpenAI(api_key=config.api_key)
        except ImportError:
            raise ImportError("Install openai: pip install openai")

        logger.info(f"Initialized OpenAI provider with model: {self.model}")

    async def complete(self, prompt: str, **kwargs) -> str:
        """Generate completion using OpenAI API"""
        try:
            message = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                top_p=self.top_p,
                timeout=self.timeout,
            )
            return message.choices[0].message.content
        except Exception as e:
            logger.error(f"OpenAI completion error: {str(e)}")
            raise

    async def stream_complete(self, prompt: str, **kwargs):
        """Stream completions from OpenAI"""
        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                top_p=self.top_p,
                stream=True,
            )
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            logger.error(f"OpenAI streaming error: {str(e)}")
            raise

    def validate_connection(self) -> bool:
        """Test OpenAI connection"""
        try:
            import asyncio
            asyncio.run(
                self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": "test"}],
                    max_tokens=10,
                )
            )
            return True
        except Exception as e:
            logger.error(f"OpenAI connection validation failed: {str(e)}")
            return False


class AnthropicProvider(LLMProvider):
    """Anthropic Claude API Provider"""

    def __init__(self, config: LLMConfig):
        super().__init__(config)
        
        if not config.api_key:
            raise ValueError("ANTHROPIC_API_KEY environment variable not set")
        
        try:
            from anthropic import AsyncAnthropic
            self.client = AsyncAnthropic(api_key=config.api_key)
        except ImportError:
            raise ImportError("Install anthropic: pip install anthropic")

        logger.info(f"Initialized Anthropic provider with model: {self.model}")

    async def complete(self, prompt: str, **kwargs) -> str:
        """Generate completion using Anthropic API"""
        try:
            message = await self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.temperature,
                top_p=self.top_p,
            )
            return message.content[0].text
        except Exception as e:
            logger.error(f"Anthropic completion error: {str(e)}")
            raise

    async def stream_complete(self, prompt: str, **kwargs):
        """Stream completions from Anthropic"""
        try:
            with self.client.messages.stream(
                model=self.model,
                max_tokens=self.max_tokens,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.temperature,
                top_p=self.top_p,
            ) as stream:
                for text in stream.text_stream:
                    yield text
        except Exception as e:
            logger.error(f"Anthropic streaming error: {str(e)}")
            raise

    def validate_connection(self) -> bool:
        """Test Anthropic connection"""
        try:
            import asyncio
            asyncio.run(
                self.client.messages.create(
                    model=self.model,
                    max_tokens=10,
                    messages=[{"role": "user", "content": "test"}],
                )
            )
            return True
        except Exception as e:
            logger.error(f"Anthropic connection validation failed: {str(e)}")
            return False


class OllamaProvider(LLMProvider):
    """Local Ollama Provider - for on-premises/offline scenarios"""

    def __init__(self, config: LLMConfig):
        super().__init__(config)
        self.base_url = config.base_url or "http://localhost:11434"
        
        try:
            import ollama
            self.client = ollama.Client(host=self.base_url)
        except ImportError:
            raise ImportError("Install ollama: pip install ollama")

        logger.info(f"Initialized Ollama provider with model: {self.model}")

    async def complete(self, prompt: str, **kwargs) -> str:
        """Generate completion using local Ollama model"""
        try:
            response = self.client.generate(
                model=self.model,
                prompt=prompt,
                temperature=self.temperature,
                num_predict=self.max_tokens,
                stream=False,
            )
            return response["response"]
        except Exception as e:
            logger.error(f"Ollama completion error: {str(e)}")
            raise

    async def stream_complete(self, prompt: str, **kwargs):
        """Stream completions from Ollama"""
        try:
            response = self.client.generate(
                model=self.model,
                prompt=prompt,
                temperature=self.temperature,
                num_predict=self.max_tokens,
                stream=True,
            )
            for chunk in response:
                if chunk["response"]:
                    yield chunk["response"]
        except Exception as e:
            logger.error(f"Ollama streaming error: {str(e)}")
            raise

    def validate_connection(self) -> bool:
        """Test Ollama connection"""
        try:
            self.client.generate(
                model=self.model,
                prompt="test",
                stream=False,
            )
            return True
        except Exception as e:
            logger.error(f"Ollama connection validation failed: {str(e)}")
            return False


class LLMProviderFactory:
    """Factory for creating LLM provider instances with environment-based configuration"""

    _instances: Dict[str, LLMProvider] = {}

    @staticmethod
    def load_config_from_env() -> LLMConfig:
        """Load LLM configuration from environment variables"""
        provider_str = os.getenv("LLM_PROVIDER", "groq").lower()
        
        try:
            provider = LLMProviderType[provider_str.upper()]
        except KeyError:
            logger.warning(f"Unknown provider: {provider_str}, defaulting to Groq")
            provider = LLMProviderType.GROQ

        model_map = {
            LLMProviderType.GROQ: os.getenv("GROQ_MODEL", "mixtral-8x7b-32768"),
            LLMProviderType.OPENAI: os.getenv("OPENAI_MODEL", "gpt-4"),
            LLMProviderType.ANTHROPIC: os.getenv("ANTHROPIC_MODEL", "claude-3-opus-20240229"),
            LLMProviderType.OLLAMA: os.getenv("OLLAMA_MODEL", "llama2"),
        }

        api_key_map = {
            LLMProviderType.GROQ: os.getenv("GROQ_API_KEY"),
            LLMProviderType.OPENAI: os.getenv("OPENAI_API_KEY"),
            LLMProviderType.ANTHROPIC: os.getenv("ANTHROPIC_API_KEY"),
            LLMProviderType.OLLAMA: None,  # Local model, no API key needed
        }

        return LLMConfig(
            provider=provider,
            model=model_map[provider],
            api_key=api_key_map[provider],
            base_url=os.getenv("LLM_BASE_URL"),
            temperature=float(os.getenv("LLM_TEMPERATURE", "0.7")),
            max_tokens=int(os.getenv("LLM_MAX_TOKENS", "2048")),
            top_p=float(os.getenv("LLM_TOP_P", "0.9")),
        )

    @staticmethod
    def create_provider(config: Optional[LLMConfig] = None) -> LLMProvider:
        """
        Create LLM provider instance based on configuration
        
        Args:
            config: LLM configuration. If None, loads from environment variables.
            
        Returns:
            Configured LLM provider instance
        """
        if config is None:
            config = LLMProviderFactory.load_config_from_env()

        provider_key = f"{config.provider.value}_{config.model}"

        # Return cached instance if exists
        if provider_key in LLMProviderFactory._instances:
            return LLMProviderFactory._instances[provider_key]

        # Create new provider instance
        if config.provider == LLMProviderType.GROQ:
            provider = GroqProvider(config)
        elif config.provider == LLMProviderType.OPENAI:
            provider = OpenAIProvider(config)
        elif config.provider == LLMProviderType.ANTHROPIC:
            provider = AnthropicProvider(config)
        elif config.provider == LLMProviderType.OLLAMA:
            provider = OllamaProvider(config)
        else:
            raise ValueError(f"Unknown provider: {config.provider}")

        # Validate connection
        if not provider.validate_connection():
            raise RuntimeError(
                f"Failed to validate connection to {config.provider.value}"
            )

        # Cache and return
        LLMProviderFactory._instances[provider_key] = provider
        logger.info(
            f"Created and cached {config.provider.value} provider: {config.model}"
        )

        return provider

    @staticmethod
    def get_default_provider() -> LLMProvider:
        """Get the default LLM provider configured via environment"""
        return LLMProviderFactory.create_provider()

    @staticmethod
    def clear_cache():
        """Clear provider instance cache"""
        LLMProviderFactory._instances.clear()
        logger.info("Cleared LLM provider cache")


# Usage example:
if __name__ == "__main__":
    import asyncio

    async def test_provider():
        # Load from environment: LLM_PROVIDER=groq GROQ_API_KEY=xxx
        provider = LLMProviderFactory.get_default_provider()

        # Generate completion
        response = await provider.complete(
            "Explain the benefits of a multi-tenant HR system in 3 sentences."
        )
        print("Response:", response)

        # Stream response
        print("\nStreaming response:")
        async for chunk in provider.stream_complete(
            "List 5 key security features of enterprise HR platforms."
        ):
            print(chunk, end="", flush=True)
        print()

    asyncio.run(test_provider())