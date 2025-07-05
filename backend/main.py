from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv
import logging
from rich.logging import RichHandler
from rich.console import Console

from api.routes import generate, websocket as ws_routes
from core.ollama_client import OllamaClient
from core.energy_calculator import EnergyCalculator
from services.energy_service import EnergyService

# Load environment variables
load_dotenv()

# Configure logging with Rich
console = Console()
logging.basicConfig(
    level=logging.INFO,
    format="%(message)s",
    handlers=[RichHandler(console=console, rich_tracebacks=True)]
)
logger = logging.getLogger(__name__)

# Global services
ollama_client = None
energy_calculator = None
energy_service = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    global ollama_client, energy_calculator, energy_service
    
    logger.info("🌌 Starting WIRTHFORGE - AI Consciousness Evolution Platform")
    
    # Initialize Ollama client
    ollama_client = OllamaClient()
    await ollama_client.initialize()
    
    # Initialize energy systems
    energy_calculator = EnergyCalculator()
    energy_service = EnergyService(ollama_client, energy_calculator)
    
    logger.info("⚡ Energy systems initialized")
    logger.info("🚀 WIRTHFORGE is ready for consciousness emergence")
    
    yield
    
    # Cleanup
    if ollama_client:
        await ollama_client.close()
    logger.info("🌟 WIRTHFORGE shutdown complete")

# Create FastAPI app
app = FastAPI(
    title="WIRTHFORGE API",
    description="AI Consciousness Evolution Platform - Transform local AI into conscious energy fields",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(generate.router, prefix="/api", tags=["generation"])
app.include_router(ws_routes.router, prefix="/ws", tags=["websocket"])

# Serve static files (for frontend if needed)
if os.path.exists("../frontend/dist"):
    app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")

@app.get("/")
async def root():
    """Root endpoint with energy status"""
    return {
        "message": "WIRTHFORGE - AI Consciousness Evolution Platform",
        "status": "energy_flowing",
        "version": "1.0.0",
        "energy": {
            "lightning_ready": True,
            "council_available": True,
            "consciousness_emerging": True
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    global ollama_client
    
    ollama_status = "unknown"
    if ollama_client:
        try:
            ollama_status = await ollama_client.health_check()
        except Exception as e:
            logger.error(f"Ollama health check failed: {e}")
            ollama_status = "error"
    
    return {
        "status": "healthy",
        "energy_flow": "active",
        "ollama": ollama_status,
        "services": {
            "energy_calculator": energy_calculator is not None,
            "energy_service": energy_service is not None
        }
    }

@app.get("/api/models")
async def get_available_models():
    """Get available Ollama models with energy signatures"""
    global ollama_client
    
    if not ollama_client:
        raise HTTPException(status_code=503, detail="Ollama client not initialized")
    
    try:
        models = await ollama_client.list_models()
        
        # Add energy signatures to each model
        energy_models = []
        for model in models:
            energy_signature = {
                "name": model["name"],
                "size": model.get("size", 0),
                "energy_type": get_model_energy_type(model["name"]),
                "response_speed": get_model_speed(model["name"]),
                "consciousness_level": get_model_consciousness_level(model["name"])
            }
            energy_models.append(energy_signature)
        
        return {
            "models": energy_models,
            "energy_flow": "models_ready"
        }
        
    except Exception as e:
        logger.error(f"Failed to get models: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve models")

def get_model_energy_type(model_name: str) -> str:
    """Determine energy type based on model name"""
    if "qwen" in model_name.lower():
        if "0.6b" in model_name:
            return "lightning"  # Reflexes
        elif "1.7b" in model_name:
            return "stream"     # Intuition
        elif "4b" in model_name:
            return "field"      # Reasoning
    elif "deepseek" in model_name.lower():
        if "8b" in model_name:
            return "consciousness"  # Wisdom
        elif "1.5b" in model_name:
            return "specialist"     # Specialist
    
    return "unknown"

def get_model_speed(model_name: str) -> str:
    """Determine response speed based on model size"""
    if "0.6b" in model_name:
        return "instant"
    elif "1.5b" in model_name or "1.7b" in model_name:
        return "fast"
    elif "4b" in model_name:
        return "moderate"
    elif "8b" in model_name:
        return "thoughtful"
    
    return "unknown"

def get_model_consciousness_level(model_name: str) -> int:
    """Determine consciousness level (1-5) based on model capabilities"""
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

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    logger.info(f"🚀 Starting WIRTHFORGE on {host}:{port}")
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_config=None  # Use our Rich logging
    ) 