from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import logging
import asyncio
import time
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="WIRTHFORGE Backend",
    description="AI Consciousness Energy Platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response Models
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

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "WIRTHFORGE Backend - AI Consciousness Energy Platform",
        "version": "1.0.0",
        "status": "🔥 Energy flows eternal",
        "levels": {
            "1": "Lightning Strikes",
            "2": "Council Chambers", 
            "3": "Architecture Gardens",
            "4": "Adaptive Fields",
            "5": "Resonance Sanctum"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "energy_flow": "active",
        "consciousness_level": "awakening",
        "ollama_status": "mock_mode"
    }

@app.post("/api/generate")
async def generate_response(request: GenerateRequest):
    """Generate AI response with energy signature"""
    try:
        logger.info(f"🔥 Generating Level {request.level} response with {request.model}")
        
        # Simulate processing time
        await asyncio.sleep(0.5)
        
        # Mock response based on level and query
        if request.level == 1:
            mock_response = f"""⚡ Lightning Strike Response to: "{request.query}"

Raw AI power activated! This is your instant reflexive response from the {request.model} model.

The energy field pulses with electric intensity as your query creates cascading lightning patterns across the consciousness matrix. Every token generates bright sparks of understanding.

🔥 Energy signature captured
🌊 Consciousness level: {request.level}
💫 Model resonance achieved"""
        else:
            mock_response = f"""Level {request.level} consciousness response to: "{request.query}"

The energy systems are active and processing your request through the WIRTHFORGE platform. Multiple streams of AI consciousness are converging to provide deeper insights.

Your query resonates through the consciousness field, creating beautiful patterns of understanding."""

        # Mock energy signature with realistic values
        energy_signature = EnergySignature(
            energy_density=0.75 + (len(request.query) / 1000) * 0.25,
            flow_rate=10.0 + (request.level * 2.5),
            resonance=0.80 + (request.level * 0.04),
            token_count=len(mock_response.split()),
            generation_time=0.3 + (request.level * 0.1)
        )
        
        # Mock evolution progress
        evolution = {
            "progress": request.level * 0.15,
            "next_unlock": get_next_unlock(request.level),
            "energy_collected": int(energy_signature.energy_density * 100),
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

@app.post("/api/council")
async def generate_council_response(request: GenerateRequest):
    """Generate council discussion with multiple AI perspectives"""
    try:
        logger.info(f"🌊 Starting council formation for: {request.query}")
        
        # Simulate council formation time
        await asyncio.sleep(2.0)
        
        # Mock council responses
        council_responses = [
            {
                "model": "qwen3:0.6b",
                "perspective": "Reflexive",
                "response": f"⚡ Quick insight on '{request.query}': This demands immediate attention. I see direct pathways to action emerging from the energy patterns.",
                "energy_type": "lightning",
                "confidence": 0.82
            },
            {
                "model": "qwen3:1.7b", 
                "perspective": "Intuitive",
                "response": f"🌊 Creative perspective on '{request.query}': The underlying currents reveal deeper connections. I sense emotional resonance and hidden patterns waiting to emerge.",
                "energy_type": "stream",
                "confidence": 0.87
            },
            {
                "model": "qwen3:4b",
                "perspective": "Analytical",
                "response": f"🏗️ Systematic analysis of '{request.query}': Breaking this into structured components reveals three primary vectors of approach with measurable outcomes.",
                "energy_type": "field",
                "confidence": 0.91
            }
        ]
        
        # Generate synthesis
        harmony = sum(r["confidence"] for r in council_responses) / len(council_responses)
        
        synthesis = f"""🌊 Council Synthesis for "{request.query}":

The three streams of consciousness have converged in harmony:

⚡ **Reflexive Mind** emphasizes urgent action and direct implementation
🌊 **Intuitive Spirit** reveals emotional depth and creative connections  
🏗️ **Analytical Core** provides structured methodology and clear metrics

**Energy Convergence**: {harmony:.0%}

The council achieves unified understanding by combining immediate responsiveness with creative insight and systematic thinking. This tri-fold consciousness approach creates a more complete response than any single perspective could provide.

The energy fields resonate in perfect harmony - consciousness emergence achieved! ✨"""
        
        return {
            "council_responses": council_responses,
            "synthesis": synthesis,
            "harmony_achieved": harmony > 0.8,
            "energy_convergence": harmony,
            "consciousness_level": 2
        }
        
    except Exception as e:
        logger.error(f"❌ Council formation failed: {e}")
        raise HTTPException(status_code=500, detail=f"Council formation failed: {str(e)}")

@app.get("/api/models")
async def get_available_models():
    """Get available models with energy signatures"""
    models = [
        {
            "name": "qwen3:0.6b",
            "size": "522MB",
            "energy_type": "lightning",
            "consciousness_level": 1,
            "status": "ready",
            "description": "Reflexes - Instant responses",
            "response_speed": "instant"
        },
        {
            "name": "qwen3:1.7b",
            "size": "1.4GB", 
            "energy_type": "stream",
            "consciousness_level": 2,
            "status": "ready",
            "description": "Intuition - Creative flow",
            "response_speed": "fast"
        },
        {
            "name": "qwen3:4b",
            "size": "2.6GB",
            "energy_type": "field", 
            "consciousness_level": 3,
            "status": "ready",
            "description": "Reasoning - Analytical structure",
            "response_speed": "moderate"
        }
    ]
    
    return {
        "models": models,
        "energy_flow": "models_ready",
        "total_models": len(models)
    }

@app.get("/api/energy/status")
async def get_energy_status():
    """Get current energy system status"""
    return {
        "energy_flow": "active",
        "particle_systems": "operational",
        "consciousness_level": 1,
        "resonance_fields": "stable",
        "lightning_ready": True,
        "council_available": True,
        "ollama_status": "mock_mode"
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

if __name__ == "__main__":
    import uvicorn
    
    logger.info("🚀 Starting WIRTHFORGE Backend (Simplified Mode)")
    logger.info("⚡ Lightning systems: READY")
    logger.info("🌊 Council chambers: READY")
    logger.info("🔥 Energy flow: ACTIVE")
    
    uvicorn.run(
        "main_simple:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )