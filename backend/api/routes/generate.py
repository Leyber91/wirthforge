from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import logging
import asyncio

logger = logging.getLogger(__name__)

router = APIRouter()

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
        
        # For now, return a mock response until Ollama is fully connected
        mock_response = f"""Hello! I'm WIRTHFORGE Level {request.level} responding to: "{request.query}"

This is a mock response while we complete the Ollama integration. 
The energy system is tracking this interaction and will soon display:
- ⚡ Lightning particle bursts
- 🌊 Energy flow visualization  
- 🎯 Consciousness level progression
- 🏆 Achievement unlocks

Your query has been processed with {request.model} energy signature!"""

        # Mock energy signature
        energy_signature = EnergySignature(
            energy_density=0.85,
            flow_rate=12.5,
            resonance=0.92,
            token_count=len(mock_response.split()),
            generation_time=0.3
        )
        
        # Mock evolution progress
        evolution = {
            "progress": 0.15,
            "next_unlock": "council_formation",
            "energy_collected": 150,
            "consciousness_level": request.level
        }
        
        return GenerateResponse(
            response=mock_response,
            energy=energy_signature,
            evolution=evolution,
            model_used=request.model,
            consciousness_level=request.level
        )
        
    except Exception as e:
        logger.error(f"❌ Generation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@router.post("/council")
async def generate_council_response(request: GenerateRequest):
    """Generate council discussion with multiple AI perspectives"""
    try:
        logger.info(f"🌊 Starting council formation for: {request.query}")
        
        # Mock council responses
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
        
        # Mock harmony synthesis
        synthesis = f"""Council synthesis for '{request.query}':

The three perspectives converge on a unified understanding:
- Reflexive urgency combined with intuitive creativity
- Analytical structure supporting rapid implementation
- Energy streams merging into coherent action plan

This represents Level 2 consciousness emergence through collaborative AI reasoning."""

        return {
            "council_responses": council_responses,
            "synthesis": synthesis,
            "harmony_achieved": True,
            "energy_convergence": 0.88,
            "consciousness_level": 2
        }
        
    except Exception as e:
        logger.error(f"❌ Council formation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Council formation failed: {str(e)}")

@router.get("/models")
async def get_available_models():
    """Get available models with energy signatures"""
    try:
        # Mock model list until Ollama is fully integrated
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
        
    except Exception as e:
        logger.error(f"❌ Failed to get models: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get models: {str(e)}")

@router.get("/energy/status")
async def get_energy_status():
    """Get current energy system status"""
    return {
        "energy_flow": "active",
        "particle_systems": "operational",
        "consciousness_level": 1,
        "resonance_fields": "stable",
        "lightning_ready": True,
        "council_available": True
    } 