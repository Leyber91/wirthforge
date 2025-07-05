import asyncio
import logging
from typing import Dict, List, Optional, AsyncGenerator
import ollama
from pydantic import BaseModel
import json
import time

logger = logging.getLogger(__name__)

class ModelInfo(BaseModel):
    name: str
    size: int
    energy_type: str
    consciousness_level: int
    loaded: bool = False
    last_used: Optional[float] = None

class EnergyResponse(BaseModel):
    content: str
    energy_signature: Dict
    timing_pattern: Dict
    consciousness_level: int
    model_used: str

class OllamaClient:
    """Energy-aware Ollama client for WIRTHFORGE"""
    
    def __init__(self):
        self.client = ollama.AsyncClient()
        self.loaded_models: Dict[str, ModelInfo] = {}
        self.max_loaded_models = 6  # From WIRTHFORGE config
        self.parallel_limit = 4     # From WIRTHFORGE config
        self.active_generations = 0
        
    async def initialize(self):
        """Initialize the Ollama client and check available models"""
        try:
            # Test connection
            await self.health_check()
            
            # Get available models
            models = await self.list_models()
            logger.info(f"🔥 Found {len(models)} available models")
            
            # Load the primary reflexes model (qwen3:0.6b)
            primary_model = "qwen3:0.6b"
            if any(m["name"] == primary_model for m in models):
                await self.load_model(primary_model)
                logger.info(f"⚡ Primary model {primary_model} loaded for instant responses")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize Ollama client: {e}")
            raise
    
    async def health_check(self) -> str:
        """Check if Ollama is running and responsive"""
        try:
            # Use synchronous client for health check
            models = ollama.list()
            return "healthy"
        except Exception as e:
            logger.error(f"Ollama health check failed: {e}")
            return "error"
    
    async def list_models(self) -> List[Dict]:
        """List all available models with energy signatures"""
        try:
            # Use synchronous client for listing models
            response = ollama.list()
            models = []
            
            # Response is a ListResponse object with models attribute
            model_list = response.models if hasattr(response, 'models') else []
            
            for model in model_list:
                # Each model has a 'model' attribute (not 'name')
                model_name = model.model if hasattr(model, 'model') else str(model)
                
                if model_name:
                    # Get model size from the model object
                    model_size = model.size if hasattr(model, 'size') else 0
                    modified_at = model.modified_at if hasattr(model, 'modified_at') else None
                    
                    energy_info = {
                        "name": model_name,
                        "size": model_size,
                        "modified_at": modified_at,
                        "energy_type": self._get_energy_type(model_name),
                        "consciousness_level": self._get_consciousness_level(model_name),
                        "response_speed": self._get_response_speed(model_name)
                    }
                    models.append(energy_info)
            
            logger.info(f"🔥 Found {len(models)} available models")
            return models
            
        except Exception as e:
            logger.error(f"Failed to list models: {e}")
            return []
    
    async def load_model(self, model_name: str) -> bool:
        """Load a model into memory for faster responses"""
        try:
            # Check if we need to unload models to make room
            if len(self.loaded_models) >= self.max_loaded_models:
                await self._unload_least_used_model()
            
            # Load the model by making a small request
            await self.client.generate(
                model=model_name,
                prompt="test",
                stream=False,
                options={"num_predict": 1}
            )
            
            self.loaded_models[model_name] = ModelInfo(
                name=model_name,
                size=0,  # Will be updated when we get model info
                energy_type=self._get_energy_type(model_name),
                consciousness_level=self._get_consciousness_level(model_name),
                loaded=True,
                last_used=time.time()
            )
            
            logger.info(f"🔥 Model {model_name} loaded into energy field")
            return True
            
        except Exception as e:
            logger.error(f"Failed to load model {model_name}: {e}")
            return False
    
    async def generate_with_energy(
        self,
        model: str,
        prompt: str,
        stream: bool = False,
        **kwargs
    ) -> AsyncGenerator[EnergyResponse, None]:
        """Generate response with energy signature tracking"""
        
        if self.active_generations >= self.parallel_limit:
            raise Exception("Maximum parallel generations reached")
        
        self.active_generations += 1
        start_time = time.time()
        
        try:
            # Update model usage
            if model in self.loaded_models:
                self.loaded_models[model].last_used = time.time()
            
            # Generate response with streaming
            response_content = ""
            token_times = []
            
            async for chunk in await self.client.generate(
                model=model,
                prompt=prompt,
                stream=True,
                **kwargs
            ):
                if chunk.get("response"):
                    token_times.append(time.time())
                    response_content += chunk["response"]
                    
                    # Calculate energy signature
                    energy_signature = self._calculate_energy_signature(
                        response_content, token_times, start_time
                    )
                    
                    yield EnergyResponse(
                        content=response_content,
                        energy_signature=energy_signature,
                        timing_pattern=self._calculate_timing_pattern(token_times),
                        consciousness_level=self._get_consciousness_level(model),
                        model_used=model
                    )
                
                if chunk.get("done"):
                    break
            
        except Exception as e:
            logger.error(f"Generation failed: {e}")
            raise
        finally:
            self.active_generations -= 1
    
    async def generate_council_parallel(
        self,
        models: List[str],
        prompt: str,
        **kwargs
    ) -> AsyncGenerator[Dict, None]:
        """Generate responses from multiple models in parallel for council formation"""
        
        if len(models) > self.parallel_limit:
            raise Exception(f"Too many models for parallel generation: {len(models)} > {self.parallel_limit}")
        
        # Create tasks for each model
        tasks = []
        for model in models:
            task = asyncio.create_task(
                self._generate_single_council_response(model, prompt, **kwargs)
            )
            tasks.append((model, task))
        
        # Yield responses as they complete
        completed_models = set()
        while len(completed_models) < len(models):
            for model, task in tasks:
                if model not in completed_models and task.done():
                    try:
                        response = await task
                        completed_models.add(model)
                        yield {
                            "model": model,
                            "response": response,
                            "energy_type": self._get_energy_type(model),
                            "consciousness_level": self._get_consciousness_level(model)
                        }
                    except Exception as e:
                        logger.error(f"Council generation failed for {model}: {e}")
                        completed_models.add(model)
            
            await asyncio.sleep(0.1)  # Small delay to prevent busy waiting
    
    async def _generate_single_council_response(
        self,
        model: str,
        prompt: str,
        **kwargs
    ) -> str:
        """Generate a single response for council formation"""
        try:
            response = await self.client.generate(
                model=model,
                prompt=prompt,
                stream=False,
                **kwargs
            )
            return response.get("response", "")
        except Exception as e:
            logger.error(f"Single council generation failed for {model}: {e}")
            return f"Error generating response from {model}"
    
    def _calculate_energy_signature(
        self,
        content: str,
        token_times: List[float],
        start_time: float
    ) -> Dict:
        """Calculate energy signature for the response"""
        if not token_times:
            return {"energy_density": 0, "flow_rate": 0, "resonance": 0}
        
        # Calculate timing metrics
        intervals = [token_times[i] - token_times[i-1] for i in range(1, len(token_times))]
        avg_interval = sum(intervals) / len(intervals) if intervals else 0
        
        # Energy density based on content richness
        energy_density = len(content) / (token_times[-1] - start_time) if token_times else 0
        
        # Flow rate based on token generation speed
        flow_rate = len(token_times) / (token_times[-1] - start_time) if token_times else 0
        
        # Resonance based on consistency of intervals
        resonance = 1.0 / (1.0 + (max(intervals) - min(intervals)) if intervals else 1.0)
        
        return {
            "energy_density": energy_density,
            "flow_rate": flow_rate,
            "resonance": resonance,
            "token_count": len(token_times),
            "generation_time": token_times[-1] - start_time if token_times else 0
        }
    
    def _calculate_timing_pattern(self, token_times: List[float]) -> Dict:
        """Calculate timing patterns for energy visualization"""
        if len(token_times) < 2:
            return {"intervals": [], "rhythm": 0, "bursts": []}
        
        intervals = [token_times[i] - token_times[i-1] for i in range(1, len(token_times))]
        avg_interval = sum(intervals) / len(intervals)
        
        # Detect bursts (faster than average generation)
        bursts = []
        for i, interval in enumerate(intervals):
            if interval < avg_interval * 0.5:  # Burst threshold
                bursts.append({
                    "position": i,
                    "speed": avg_interval / interval,
                    "intensity": min(2.0, avg_interval / interval)
                })
        
        return {
            "intervals": intervals,
            "rhythm": 1.0 / avg_interval if avg_interval > 0 else 0,
            "bursts": bursts
        }
    
    def _get_energy_type(self, model_name: str) -> str:
        """Get energy type based on model name"""
        if "qwen" in model_name.lower():
            if "0.6b" in model_name:
                return "lightning"
            elif "1.7b" in model_name:
                return "stream"
            elif "4b" in model_name:
                return "field"
        elif "deepseek" in model_name.lower():
            if "8b" in model_name:
                return "consciousness"
            elif "1.5b" in model_name:
                return "specialist"
        
        return "unknown"
    
    def _get_consciousness_level(self, model_name: str) -> int:
        """Get consciousness level (1-5) based on model capabilities"""
        if "0.6b" in model_name:
            return 1  # Reflexes
        elif "1.7b" in model_name:
            return 2  # Intuition
        elif "4b" in model_name:
            return 3  # Reasoning
        elif "1.5b" in model_name:
            return 4  # Specialist
        elif "8b" in model_name:
            return 5  # Wisdom
        
        return 1
    
    def _get_response_speed(self, model_name: str) -> str:
        """Get expected response speed"""
        if "0.6b" in model_name:
            return "instant"
        elif "1.5b" in model_name or "1.7b" in model_name:
            return "fast"
        elif "4b" in model_name:
            return "moderate"
        elif "8b" in model_name:
            return "thoughtful"
        
        return "unknown"
    
    async def _unload_least_used_model(self):
        """Unload the least recently used model to make room"""
        if not self.loaded_models:
            return
        
        # Find least recently used model
        lru_model = min(
            self.loaded_models.keys(),
            key=lambda k: self.loaded_models[k].last_used or 0
        )
        
        # Remove from loaded models
        del self.loaded_models[lru_model]
        logger.info(f"🔥 Unloaded model {lru_model} to make room")
    
    async def close(self):
        """Clean up resources"""
        # Close any open connections
        logger.info("🌟 Ollama client closed") 