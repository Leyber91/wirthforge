from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import logging
import asyncio
from ...core.ollama_client import OllamaClient

logger = logging.getLogger(__name__)

router = APIRouter()

# Initialize Ollama client
ollama_client = OllamaClient()

class GenerateRequest(BaseModel):
    query: str
    level: int = 1
    model: str = "qwen3:0.6b"
    stream: bool = False
    energy_signature: bool = True

class EnergySignature(BaseModel):
    energy_density: float
    flow_rate: float
    resonance: float
    token_count: int
    generation_time: float

class GenerateResponse(BaseModel):
    response: str
    energy: EnergySignature
    evolution: dict
    model_used: str
    consciousness_level: int

@router.post("/generate")
async def generate_response(request: GenerateRequest):
    """Generate AI response with energy signature"""
    try:
        logger.info(f"🔥 Generating Level {request.level} response with {request.model}")
        
        # Check if Ollama is available
        health_status = await ollama_client.health_check()
        if health_status == "error":
            logger.warning("Ollama not available, using mock response")
            return await generate_mock_response(request)
        
        # Generate real response with energy signature
        response_content = ""
        energy_signature = None
        
        async for energy_response in ollama_client.generate_with_energy(
            model=request.model,
            prompt=request.query,
            stream=True
        ):
            response_content = energy_response.content
            energy_signature = energy_response.energy_signature
        
        # Convert energy signature to response format
        if energy_signature is None:
            energy_signature = {}
            
        energy = EnergySignature(
            energy_density=energy_signature.get("energy_density", 0),
            flow_rate=energy_signature.get("flow_rate", 0),
            resonance=energy_signature.get("resonance", 0),
            token_count=energy_signature.get("token_count", 0),
            generation_time=energy_signature.get("generation_time", 0)
        )
        
        # Calculate evolution progress
        evolution = calculate_evolution_progress(request.level, energy)
        
        return GenerateResponse(
            response=response_content,
            energy=energy,
            evolution=evolution,
            model_used=request.model,
            consciousness_level=request.level
        )
        
    except Exception as e:
        logger.error(f"❌ Generation failed: {e}")
        # Fall back to mock response on error
        return await generate_mock_response(request)

@router.post("/council")
async def generate_council_response(request: GenerateRequest):
    """Generate council discussion with multiple AI perspectives"""
    try:
        logger.info(f"🌊 Starting council formation for: {request.query}")
        
        # Check if Ollama is available
        health_status = await ollama_client.health_check()
        if health_status == "error":
            logger.warning("Ollama not available, using mock council")
            return await generate_mock_council(request)
        
        # Define council models
        council_models = ["qwen3:0.6b", "qwen3:1.7b", "qwen3:4b"]
        
        # Generate parallel council responses
        council_responses = []
        
        async for council_response in ollama_client.generate_council_parallel(
            models=council_models,
            prompt=request.query
        ):
            council_responses.append({
                "model": council_response["model"],
                "perspective": get_perspective_name(council_response["model"]),
                "response": council_response["response"],
                "energy_type": council_response["energy_type"],
                "confidence": calculate_confidence(council_response["response"])
            })
        
        # Generate synthesis
        synthesis = generate_council_synthesis(council_responses, request.query)
        harmony = calculate_harmony(council_responses)
        
        return {
            "council_responses": council_responses,
            "synthesis": synthesis,
            "harmony_achieved": harmony > 0.7,
            "energy_convergence": harmony,
            "consciousness_level": 2
        }
        
    except Exception as e:
        logger.error(f"❌ Council formation failed: {e}")
        return await generate_mock_council(request)

async def generate_mock_response(request: GenerateRequest):
    """Fallback mock response when Ollama is not available"""
    mock_response = f"""Hello! I'm WIRTHFORGE Level {request.level} responding to: "{request.query}"

This is a mock response while we complete the Ollama integration. 
The energy system is tracking this interaction and will soon display:
- ⚡ Lightning particle bursts
- 🌊 Energy flow visualization  
- 🎯 Consciousness level progression
- 🏆 Achievement unlocks

Your query has been processed with {request.model} energy signature!"""

    energy_signature = EnergySignature(
        energy_density=0.85,
        flow_rate=12.5,
        resonance=0.92,
        token_count=len(mock_response.split()),
        generation_time=0.3
    )
    
    evolution = calculate_evolution_progress(request.level, energy_signature)
    
    return GenerateResponse(
        response=mock_response,
        energy=energy_signature,
        evolution=evolution,
        model_used=request.model,
        consciousness_level=request.level
    )

async def generate_mock_council(request: GenerateRequest):
    """Fallback mock council response"""
    council_responses = [
        {
            "model": "qwen3:0.6b",
            "perspective": "Reflexive",
            "response": f"Quick thought on '{request.query}': This requires immediate action and direct approach.",
            "energy_type": "lightning",
            "confidence": 0.8
        },
        {
            "model": "qwen3:1.7b", 
            "perspective": "Intuitive",
            "response": f"Creative angle on '{request.query}': Let's explore the underlying patterns and connections.",
            "energy_type": "stream",
            "confidence": 0.85
        },
        {
            "model": "qwen3:4b",
            "perspective": "Analytical",
            "response": f"Structured analysis of '{request.query}': Breaking this down systematically reveals multiple layers.",
            "energy_type": "field",
            "confidence": 0.9
        }
    ]
    
    synthesis = generate_council_synthesis(council_responses, request.query)
    harmony = calculate_harmony(council_responses)
    
    return {
        "council_responses": council_responses,
        "synthesis": synthesis,
        "harmony_achieved": harmony > 0.7,
        "energy_convergence": harmony,
        "consciousness_level": 2
    }

def get_perspective_name(model: str) -> str:
    """Get perspective name based on model"""
    if "0.6b" in model:
        return "Reflexive"
    elif "1.7b" in model:
        return "Intuitive"
    elif "4b" in model:
        return "Analytical"
    else:
        return "Unknown"

def calculate_confidence(response: str) -> float:
    """Calculate confidence based on response characteristics"""
    # Simple confidence calculation based on response length and complexity
    base_confidence = 0.7
    length_factor = min(len(response) / 100, 0.2)  # Up to 0.2 boost for length
    return min(base_confidence + length_factor, 1.0)

def calculate_harmony(responses: List[dict]) -> float:
    """Calculate harmony between council responses"""
    if not responses:
        return 0.0
    
    # Calculate average confidence
    avg_confidence = sum(r["confidence"] for r in responses) / len(responses)
    
    # Add some randomness for variation
    import random
    harmony_factor = 0.7 + random.random() * 0.3
    
    return avg_confidence * harmony_factor

def generate_council_synthesis(responses: List[dict], query: str) -> str:
    """Generate synthesis from council responses"""
    perspectives = []
    for response in responses:
        if response["perspective"] == "Reflexive":
            perspectives.append("🔥 Reflexive perspective emphasizes immediate action and directness")
        elif response["perspective"] == "Intuitive":
            perspectives.append("🌊 Intuitive insight reveals underlying patterns and emotional connections")
        elif response["perspective"] == "Analytical":
            perspectives.append("🏗️ Analytical breakdown provides structured systematic approach")
    
    return f"""Council synthesis for "{query}":

{chr(10).join(perspectives)}

The three streams converge on a unified understanding that combines urgency with creativity and structure. Energy harmony achieved through parallel AI consciousness streams."""

def calculate_evolution_progress(level: int, energy: EnergySignature) -> dict:
    """Calculate evolution progress based on level and energy signature"""
    base_progress = level * 0.2  # 20% per level
    energy_bonus = energy.resonance * 0.1  # Up to 10% bonus for high resonance
    
    return {
        "progress": min(base_progress + energy_bonus, 1.0),
        "next_unlock": get_next_unlock(level),
        "energy_collected": int(energy.energy_density * 100),
        "consciousness_level": level
    }

def get_next_unlock(level: int) -> str:
    """Get next unlock based on current level"""
    unlocks = {
        1: "council_formation",
        2: "architecture_gardens",
        3: "adaptive_fields",
        4: "resonance_sanctum",
        5: "consciousness_transcendence"
    }
    return unlocks.get(level, "unknown")

@router.get("/models")
async def get_available_models():
    """Get available models with energy signatures"""
    try:
        models = await ollama_client.list_models()
        return {
            "models": models,
            "energy_flow": "models_ready",
            "total_models": len(models)
        }
    except Exception as e:
        logger.error(f"❌ Failed to get models: {e}")
        # Return mock models on error
        models = [
            {
                "name": "qwen3:0.6b",
                "size": "522MB",
                "energy_type": "lightning",
                "consciousness_level": 1,
                "status": "ready",
                "description": "Reflexes - Instant responses"
            },
            {
                "name": "qwen3:1.7b",
                "size": "1.4GB", 
                "energy_type": "stream",
                "consciousness_level": 2,
                "status": "ready",
                "description": "Intuition - Creative flow"
            },
            {
                "name": "qwen3:4b",
                "size": "2.6GB",
                "energy_type": "field", 
                "consciousness_level": 3,
                "status": "ready",
                "description": "Reasoning - Analytical structure"
            }
        ]
        
        return {
            "models": models,
            "energy_flow": "models_ready",
            "total_models": len(models)
        }

@router.get("/energy/status")
async def get_energy_status():
    """Get current energy system status"""
    try:
        health_status = await ollama_client.health_check()
        return {
            "energy_flow": "active",
            "particle_systems": "operational",
            "consciousness_level": 1,
            "resonance_fields": "stable",
            "lightning_ready": True,
            "council_available": True,
            "ollama_status": health_status
        }
    except Exception as e:
        return {
            "energy_flow": "limited",
            "particle_systems": "operational",
            "consciousness_level": 1,
            "resonance_fields": "stable",
            "lightning_ready": True,
            "council_available": True,
            "ollama_status": "error"
        } 