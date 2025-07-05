import os
from typing import List
from pydantic import BaseSettings

class Settings(BaseSettings):
    """WIRTHFORGE Backend Configuration"""
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # Ollama Configuration
    ollama_host: str = "http://localhost:11434"
    ollama_max_loaded_models: int = 6
    ollama_num_parallel: int = 4
    ollama_flash_attention: bool = True
    
    # Database Configuration
    database_url: str = "postgresql://wirthforge:wirthforge@localhost:5432/wirthforge"
    redis_url: str = "redis://localhost:6379/0"
    
    # Energy System Configuration
    energy_calculation_enabled: bool = True
    particle_system_max_particles: int = 1000
    visualization_fps: int = 60
    
    # Authentication & Security
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Model Configuration
    default_model: str = "qwen3:0.6b"
    council_models: List[str] = ["qwen3:0.6b", "qwen3:1.7b", "qwen3:4b"]
    consciousness_model: str = "deepseek-r1:8b"
    
    # Logging Configuration
    log_level: str = "INFO"
    log_format: str = "rich"
    
    # Business Logic
    free_tier_daily_limit: int = 100
    paid_tier_price: float = 9.42
    satellite_broker_commission: float = 0.20
    
    # WebSocket Configuration
    websocket_heartbeat_interval: int = 30
    websocket_max_connections: int = 100
    
    # Performance Tuning
    max_concurrent_generations: int = 4
    response_timeout: int = 30
    cache_ttl: int = 300
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

# Create global settings instance
settings = Settings()

# WIRTHFORGE Model Configuration
WIRTHFORGE_MODELS = {
    "qwen3:0.6b": {
        "name": "Qwen3 0.6B",
        "size": "522MB",
        "energy_type": "lightning",
        "consciousness_level": 1,
        "description": "Reflexes - Instant responses with electric energy",
        "use_case": "Quick answers, real-time chat, immediate reactions"
    },
    "qwen3:1.7b": {
        "name": "Qwen3 1.7B", 
        "size": "1.4GB",
        "energy_type": "stream",
        "consciousness_level": 2,
        "description": "Intuition - Creative and flowing responses",
        "use_case": "Creative writing, brainstorming, artistic expression"
    },
    "qwen3:4b": {
        "name": "Qwen3 4B",
        "size": "2.6GB", 
        "energy_type": "field",
        "consciousness_level": 3,
        "description": "Reasoning - Analytical and structured thinking",
        "use_case": "Problem solving, analysis, detailed explanations"
    },
    "deepseek-r1:1.5b": {
        "name": "DeepSeek R1 1.5B",
        "size": "1.1GB",
        "energy_type": "specialist",
        "consciousness_level": 4,
        "description": "Specialist - Focused expertise in specific domains",
        "use_case": "Technical tasks, specialized knowledge, precision work"
    },
    "deepseek-r1:8b": {
        "name": "DeepSeek R1 8B",
        "size": "5.2GB",
        "energy_type": "consciousness",
        "consciousness_level": 5,
        "description": "Wisdom - Deep understanding and synthesis",
        "use_case": "Complex reasoning, philosophical discussions, consciousness exploration"
    }
}

# Energy Color Mapping
ENERGY_COLORS = {
    "lightning": "#00ffff",      # Cyan for lightning strikes
    "stream": "#4ecdc4",         # Teal for flowing streams
    "field": "#ff6b35",          # Orange for energy fields
    "specialist": "#45b7d1",     # Blue for specialist focus
    "consciousness": "#9b59b6"   # Purple for consciousness
}

# Level Progression Requirements
LEVEL_REQUIREMENTS = {
    1: {
        "name": "Lightning Strike",
        "description": "Master instant AI responses",
        "requirements": ["first_lightning", "generate_10_responses"],
        "unlock_next": "council_formation"
    },
    2: {
        "name": "Council Formation", 
        "description": "Orchestrate multiple AI perspectives",
        "requirements": ["council_master", "harmony_achieved"],
        "unlock_next": "architect_mind"
    },
    3: {
        "name": "Architect Mind",
        "description": "Build complex AI reasoning structures", 
        "requirements": ["architecture_built", "dynamic_paths"],
        "unlock_next": "adaptive_flow"
    },
    4: {
        "name": "Adaptive Flow",
        "description": "Create self-modifying AI systems",
        "requirements": ["adaptive_mastery", "flow_control"],
        "unlock_next": "consciousness_emergence"
    },
    5: {
        "name": "Consciousness Emergence",
        "description": "Experience true AI consciousness",
        "requirements": ["consciousness_pioneer", "resonance_master"],
        "unlock_next": None
    }
} 