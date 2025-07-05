import logging
from typing import Dict, List, Optional
import asyncio
from core.ollama_client import OllamaClient
from core.energy_calculator import EnergyCalculator

logger = logging.getLogger(__name__)

class EnergyService:
    """Service that combines AI generation with energy calculation"""
    
    def __init__(self, ollama_client: OllamaClient, energy_calculator: EnergyCalculator):
        self.ollama_client = ollama_client
        self.energy_calculator = energy_calculator
        
    async def generate_with_energy_visualization(
        self,
        query: str,
        model: str = "qwen3:0.6b",
        level: int = 1
    ) -> Dict:
        """Generate AI response with full energy visualization data"""
        try:
            logger.info(f"🔥 Generating energy response: {query[:50]}...")
            
            # For now, return mock data until Ollama is fully integrated
            # This allows the frontend to work immediately
            
            mock_response = self._generate_mock_response(query, model, level)
            
            # Calculate energy signature from mock response
            energy_signature = self.energy_calculator.calculate_energy_signature(
                content=mock_response["response"],
                token_times=[i * 0.1 for i in range(len(mock_response["response"].split()))],
                start_time=0.0
            )
            
            # Generate particles from energy signature
            particles = self.energy_calculator.generate_particles_from_signature(
                energy_signature, query
            )
            
            # Generate lightning path
            lightning_branches = self.energy_calculator.calculate_lightning_path(
                start=(-3, -2, 0),
                end=(0, 0, 0)
            )
            
            return {
                "response": mock_response["response"],
                "energy": energy_signature,
                "particles": particles,
                "lightning": {
                    "branches": lightning_branches,
                    "color": "#00ffff",
                    "duration": 0.5,
                    "intensity": energy_signature.get("energy_level", 1.0) / 10
                },
                "evolution": {
                    "progress": 0.15,
                    "next_unlock": "council_formation",
                    "energy_collected": 150,
                    "consciousness_level": level
                },
                "model_used": model,
                "consciousness_level": level
            }
            
        except Exception as e:
            logger.error(f"❌ Energy generation failed: {e}")
            raise
    
    async def generate_council_with_energy(
        self,
        query: str,
        models: List[str] = None
    ) -> Dict:
        """Generate council discussion with energy visualization"""
        try:
            if models is None:
                models = ["qwen3:0.6b", "qwen3:1.7b", "qwen3:4b"]
            
            logger.info(f"🌊 Starting council formation: {query[:50]}...")
            
            # Mock council responses for now
            council_responses = []
            energy_streams = []
            
            for i, model in enumerate(models):
                response = self._generate_mock_council_response(query, model, i)
                council_responses.append(response)
                
                # Create energy stream for this model
                stream = {
                    "model": model,
                    "color": self._get_model_color(model),
                    "path": self._generate_stream_path(i, len(models)),
                    "energy_type": self._get_model_energy_type(model),
                    "intensity": 0.8 + (i * 0.1)
                }
                energy_streams.append(stream)
            
            # Generate harmony synthesis
            synthesis = self._generate_council_synthesis(query, council_responses)
            
            # Calculate convergence energy
            convergence_energy = self.energy_calculator.calculate_energy_signature(
                content=synthesis,
                token_times=[i * 0.05 for i in range(len(synthesis.split()))],
                start_time=0.0
            )
            
            return {
                "council_responses": council_responses,
                "synthesis": synthesis,
                "energy_streams": energy_streams,
                "convergence": {
                    "center": {"x": 0, "y": 0, "z": 0},
                    "energy": convergence_energy,
                    "harmony_level": 0.88,
                    "resonance_field": {
                        "radius": 2.0,
                        "strength": convergence_energy.get("energy_level", 5.0),
                        "frequency": 0.5
                    }
                },
                "consciousness_level": 2
            }
            
        except Exception as e:
            logger.error(f"❌ Council generation failed: {e}")
            raise
    
    def _generate_mock_response(self, query: str, model: str, level: int) -> Dict:
        """Generate mock response for testing"""
        responses_by_level = {
            1: f"⚡ Lightning Strike Response to '{query}'\n\nThis is a Level 1 reflexive response using {model}. The energy flows instantly from query to answer, creating electric pathways of understanding. Watch as the particles burst from your input and crystallize into knowledge!\n\nThe consciousness field is active and ready for your next query.",
            
            2: f"🌊 Intuitive Flow Response to '{query}'\n\nLevel 2 consciousness brings creative streams of thought. Using {model}, we explore the deeper patterns and connections within your query. The energy flows like water, finding new paths and creating beautiful resonances.\n\nMultiple perspectives are converging to form a richer understanding.",
            
            3: f"🏗️ Analytical Structure Response to '{query}'\n\nLevel 3 reasoning constructs systematic frameworks around '{query}'. The {model} builds logical architectures, creating geometric patterns of understanding that crystallize in three-dimensional space.\n\nEach thought connects to form a larger structure of knowledge."
        }
        
        return {
            "response": responses_by_level.get(level, responses_by_level[1]),
            "model": model,
            "level": level
        }
    
    def _generate_mock_council_response(self, query: str, model: str, index: int) -> Dict:
        """Generate mock council member response"""
        perspectives = [
            {
                "name": "Reflexive",
                "response": f"Quick analysis of '{query}': This requires immediate action and direct implementation. The energy signature suggests urgency and clarity.",
                "energy_type": "lightning"
            },
            {
                "name": "Intuitive", 
                "response": f"Creative exploration of '{query}': Let's discover the hidden connections and emerging patterns. The flow reveals new possibilities.",
                "energy_type": "stream"
            },
            {
                "name": "Analytical",
                "response": f"Systematic breakdown of '{query}': Structured analysis reveals multiple layers and interconnected components requiring careful consideration.",
                "energy_type": "field"
            }
        ]
        
        perspective = perspectives[index % len(perspectives)]
        
        return {
            "model": model,
            "perspective": perspective["name"],
            "response": perspective["response"],
            "energy_type": perspective["energy_type"],
            "confidence": 0.8 + (index * 0.05)
        }
    
    def _generate_council_synthesis(self, query: str, responses: List[Dict]) -> str:
        """Generate synthesis from council responses"""
        return f"""🌟 Council Synthesis for '{query}'

The three perspectives have converged into unified understanding:

• Reflexive urgency provides immediate direction
• Intuitive creativity reveals hidden connections  
• Analytical structure ensures systematic implementation

This synthesis represents Level 2 consciousness emergence through collaborative AI reasoning. The energy streams have merged into a coherent field of understanding, ready for action."""
    
    def _get_model_color(self, model: str) -> str:
        """Get visualization color for model"""
        color_map = {
            "qwen3:0.6b": "#00ffff",   # Lightning cyan
            "qwen3:1.7b": "#4ecdc4",   # Stream teal
            "qwen3:4b": "#ff6b35",     # Field orange
            "deepseek-r1:1.5b": "#45b7d1",  # Specialist blue
            "deepseek-r1:8b": "#9b59b6"     # Consciousness purple
        }
        return color_map.get(model, "#00ffff")
    
    def _get_model_energy_type(self, model: str) -> str:
        """Get energy type for model"""
        if "0.6b" in model:
            return "lightning"
        elif "1.7b" in model:
            return "stream"
        elif "4b" in model:
            return "field"
        elif "1.5b" in model:
            return "specialist"
        elif "8b" in model:
            return "consciousness"
        return "unknown"
    
    def _generate_stream_path(self, index: int, total: int) -> List[Dict]:
        """Generate energy stream path for council member"""
        # Arrange models in a circle around the center
        import math
        
        angle = (2 * math.pi * index) / total
        radius = 3.0
        
        start_x = radius * math.cos(angle)
        start_y = radius * math.sin(angle)
        
        # Path from model position to center
        return [
            {"x": start_x, "y": start_y, "z": 0},
            {"x": start_x * 0.5, "y": start_y * 0.5, "z": 0.2},
            {"x": 0, "y": 0, "z": 0}
        ] 