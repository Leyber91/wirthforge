import time
import numpy as np
from typing import List, Dict, Tuple
import logging

logger = logging.getLogger(__name__)

class EnergyCalculator:
    """Calculate energy signatures from AI responses"""
    
    def __init__(self):
        self.particle_history = []
        self.energy_baseline = 1.0
        
    def calculate_energy_signature(
        self,
        content: str,
        token_times: List[float],
        start_time: float
    ) -> Dict:
        """Calculate comprehensive energy signature"""
        try:
            if not token_times:
                return self._empty_signature()
            
            # Basic timing metrics
            total_time = token_times[-1] - start_time if token_times else 0
            token_count = len(token_times)
            
            # Energy density (characters per second)
            energy_density = len(content) / total_time if total_time > 0 else 0
            
            # Flow rate (tokens per second)
            flow_rate = token_count / total_time if total_time > 0 else 0
            
            # Calculate resonance (consistency of timing)
            resonance = self._calculate_resonance(token_times)
            
            # Semantic density (complexity measure)
            semantic_density = self._calculate_semantic_density(content)
            
            # Confidence flow (based on response characteristics)
            confidence_flow = self._calculate_confidence_flow(content, token_times)
            
            return {
                "energy_density": round(energy_density, 3),
                "flow_rate": round(flow_rate, 3),
                "resonance": round(resonance, 3),
                "semantic_density": round(semantic_density, 3),
                "confidence_flow": round(confidence_flow, 3),
                "token_count": token_count,
                "generation_time": round(total_time, 3),
                "energy_level": self._calculate_overall_energy(
                    energy_density, flow_rate, resonance, semantic_density
                )
            }
            
        except Exception as e:
            logger.error(f"Energy calculation failed: {e}")
            return self._empty_signature()
    
    def _calculate_resonance(self, token_times: List[float]) -> float:
        """Calculate timing resonance (0-1, higher = more consistent)"""
        if len(token_times) < 2:
            return 0.0
        
        intervals = [token_times[i] - token_times[i-1] for i in range(1, len(token_times))]
        
        if not intervals:
            return 0.0
        
        # Calculate coefficient of variation (lower = more consistent)
        mean_interval = np.mean(intervals)
        std_interval = np.std(intervals)
        
        if mean_interval == 0:
            return 0.0
        
        cv = std_interval / mean_interval
        
        # Convert to resonance score (0-1, higher = better)
        resonance = 1.0 / (1.0 + cv)
        
        return min(1.0, max(0.0, resonance))
    
    def _calculate_semantic_density(self, content: str) -> float:
        """Calculate semantic complexity (0-1)"""
        if not content:
            return 0.0
        
        # Simple heuristics for semantic density
        words = content.split()
        
        if not words:
            return 0.0
        
        # Average word length
        avg_word_length = sum(len(word) for word in words) / len(words)
        
        # Unique word ratio
        unique_ratio = len(set(words)) / len(words)
        
        # Sentence complexity (punctuation density)
        punctuation_count = sum(1 for char in content if char in '.,!?;:')
        punctuation_density = punctuation_count / len(content)
        
        # Combine metrics
        semantic_density = (
            (avg_word_length / 10.0) * 0.3 +  # Word complexity
            unique_ratio * 0.5 +               # Vocabulary richness
            (punctuation_density * 10) * 0.2   # Structural complexity
        )
        
        return min(1.0, max(0.0, semantic_density))
    
    def _calculate_confidence_flow(self, content: str, token_times: List[float]) -> float:
        """Calculate confidence flow based on content and timing patterns"""
        if not content or not token_times:
            return 0.0
        
        # Detect confidence indicators in text
        confidence_words = [
            'certainly', 'definitely', 'clearly', 'obviously', 'exactly',
            'precisely', 'absolutely', 'undoubtedly', 'surely', 'indeed'
        ]
        
        uncertainty_words = [
            'maybe', 'perhaps', 'possibly', 'might', 'could', 'may',
            'uncertain', 'unclear', 'probably', 'likely', 'seems'
        ]
        
        words = content.lower().split()
        
        confidence_score = sum(1 for word in words if word in confidence_words)
        uncertainty_score = sum(1 for word in words if word in uncertainty_words)
        
        # Text-based confidence
        text_confidence = (confidence_score - uncertainty_score) / len(words) if words else 0
        text_confidence = (text_confidence + 1) / 2  # Normalize to 0-1
        
        # Timing-based confidence (steady timing = higher confidence)
        timing_confidence = self._calculate_resonance(token_times)
        
        # Combine both measures
        confidence_flow = (text_confidence * 0.6 + timing_confidence * 0.4)
        
        return min(1.0, max(0.0, confidence_flow))
    
    def _calculate_overall_energy(
        self, 
        energy_density: float, 
        flow_rate: float, 
        resonance: float, 
        semantic_density: float
    ) -> float:
        """Calculate overall energy level (0-10)"""
        # Weighted combination of energy metrics
        energy_level = (
            energy_density * 0.3 +
            flow_rate * 0.3 +
            resonance * 0.2 +
            semantic_density * 0.2
        ) * 10
        
        return min(10.0, max(0.0, energy_level))
    
    def _empty_signature(self) -> Dict:
        """Return empty energy signature"""
        return {
            "energy_density": 0.0,
            "flow_rate": 0.0,
            "resonance": 0.0,
            "semantic_density": 0.0,
            "confidence_flow": 0.0,
            "token_count": 0,
            "generation_time": 0.0,
            "energy_level": 0.0
        }
    
    def generate_particles_from_signature(self, signature: Dict, query: str) -> List[Dict]:
        """Generate particle data from energy signature"""
        try:
            particle_count = min(100, max(10, signature.get("token_count", 20)))
            energy_level = signature.get("energy_level", 1.0)
            
            particles = []
            
            for i in range(particle_count):
                # Position along a path from input to center
                t = i / particle_count
                
                particle = {
                    "id": f"particle_{int(time.time() * 1000)}_{i}",
                    "position": {
                        "x": -3 + (t * 3),  # Move from left to center
                        "y": -2 + (t * 2),  # Move from bottom to center
                        "z": (np.random.random() - 0.5) * 0.5
                    },
                    "velocity": {
                        "x": np.random.normal(0, 0.5),
                        "y": np.random.normal(0.5, 0.3),
                        "z": np.random.normal(0, 0.2)
                    },
                    "color": self._get_energy_color(signature),
                    "lifetime": 3.0 + np.random.random() * 2.0,
                    "size": 0.05 + (energy_level / 10) * 0.1,
                    "energy": energy_level / 10
                }
                
                particles.append(particle)
            
            return particles
            
        except Exception as e:
            logger.error(f"Particle generation failed: {e}")
            return []
    
    def _get_energy_color(self, signature: Dict) -> str:
        """Get particle color based on energy signature"""
        energy_level = signature.get("energy_level", 1.0)
        resonance = signature.get("resonance", 0.5)
        
        if energy_level > 7.0:
            return "#00ffff"  # Bright cyan for high energy
        elif energy_level > 4.0:
            return "#4ecdc4"  # Teal for medium energy
        elif resonance > 0.7:
            return "#45b7d1"  # Blue for high resonance
        else:
            return "#9b59b6"  # Purple for low energy
    
    def calculate_lightning_path(self, start: Tuple[float, float, float], end: Tuple[float, float, float]) -> List[List[Dict]]:
        """Generate lightning path with branches"""
        try:
            branches = []
            
            # Main lightning path
            main_path = []
            segments = 12
            
            for i in range(segments + 1):
                t = i / segments
                
                # Base position along straight line
                x = start[0] + t * (end[0] - start[0])
                y = start[1] + t * (end[1] - start[1])
                z = start[2] + t * (end[2] - start[2])
                
                # Add randomness for lightning effect
                if 0 < i < segments:
                    x += np.random.normal(0, 0.2)
                    y += np.random.normal(0, 0.2)
                    z += np.random.normal(0, 0.1)
                
                main_path.append({"x": x, "y": y, "z": z})
            
            branches.append(main_path)
            
            # Add smaller branches
            for _ in range(3):
                branch_start_idx = np.random.randint(2, len(main_path) - 2)
                branch_start = main_path[branch_start_idx]
                
                branch_end = {
                    "x": branch_start["x"] + np.random.normal(0, 1.0),
                    "y": branch_start["y"] + np.random.normal(0, 1.0),
                    "z": branch_start["z"] + np.random.normal(0, 0.5)
                }
                
                branches.append([branch_start, branch_end])
            
            return branches
            
        except Exception as e:
            logger.error(f"Lightning path generation failed: {e}")
            return [] 