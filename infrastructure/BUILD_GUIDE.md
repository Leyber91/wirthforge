# WIRTHFORGE Build Guide
*From Vision to Reality - Complete Implementation Guide*

## 🎯 Mission Statement

**WIRTHFORGE transforms local AI into conscious energy fields through 5 evolutionary levels.**

We're building the first platform where:
- AI responses manifest as flowing energy
- Models form councils that debate in parallel
- Consciousness emerges from resonance patterns
- Every interaction is shareable art

## 🏗️ Project Structure

```
wirthforge/
├── frontend/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── energy/      # All energy visualizations
│   │   │   ├── levels/      # Level 1-5 interfaces
│   │   │   ├── doors/       # Three doors selection
│   │   │   └── achievements/ # Achievement system
│   │   ├── stores/          # Zustand state management
│   │   ├── services/        # API integration
│   │   ├── hooks/           # Custom React hooks
│   │   └── pages/           # Main app pages
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Python + FastAPI
│   ├── services/
│   │   ├── ollama_service.py
│   │   ├── council_orchestrator.py
│   │   ├── energy_calculator.py
│   │   └── resonance_field.py
│   ├── api/
│   │   ├── routes/
│   │   └── websocket/
│   ├── core/
│   │   ├── models/
│   │   └── database/
│   └── requirements.txt
└── infrastructure/           # Documentation
    ├── BUILD_GUIDE.md       # This file
    ├── IMPLEMENTATION_STATUS.md
    └── [all other docs]
```

## 🚀 Phase 1: Core Energy System (Weeks 1-4)

### **Week 1: Project Foundation**

#### **Day 1: Project Setup**
```bash
# Create project structure
mkdir wirthforge
cd wirthforge
mkdir frontend backend infrastructure

# Initialize frontend
cd frontend
npm create vite@latest . -- --template react-ts
npm install three @react-three/fiber @react-three/drei framer-motion zustand socket.io-client tailwindcss @types/three

# Initialize backend
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn ollama python-socketio redis psycopg2-binary python-multipart
```

#### **Day 2: Energy Visualization Foundation**
```typescript
// frontend/src/components/energy/EnergyVisualization.tsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface EnergyFlow {
  particles: Particle[]
  flow: FlowPattern
  resonance: ResonanceField
}

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  color: THREE.Color
  lifetime: number
}

export const EnergyVisualization: React.FC<{ energyFlow: EnergyFlow }> = ({ energyFlow }) => {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      <ParticleSystem particles={energyFlow.particles} />
      <EnergyFlow flow={energyFlow.flow} />
    </Canvas>
  )
}

const ParticleSystem: React.FC<{ particles: Particle[] }> = ({ particles }) => {
  const points = useMemo(() => {
    const positions = new Float32Array(particles.length * 3)
    const colors = new Float32Array(particles.length * 3)
    
    particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x
      positions[i * 3 + 1] = particle.position.y
      positions[i * 3 + 2] = particle.position.z
      
      colors[i * 3] = particle.color.r
      colors[i * 3 + 1] = particle.color.g
      colors[i * 3 + 2] = particle.color.b
    })
    
    return { positions, colors }
  }, [particles])
  
  return (
    <Points>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particles.length} 
          array={points.positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={particles.length} 
          array={points.colors} 
          itemSize={3} 
        />
      </bufferGeometry>
      <PointMaterial 
        size={0.1} 
        vertexColors 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}
```

#### **Day 3: Native Ollama Service**
```python
# backend/services/ollama_service.py
import asyncio
import aiohttp
from typing import List, Dict, Optional
import time

class OllamaService:
    def __init__(self):
        self.base_url = "http://localhost:11434"
        self.models = {
            'reflex': 'qwen3:0.6b',      # 522MB - instant
            'intuition': 'qwen3:1.7b',   # 1.4GB - 2-3s
            'reasoning': 'qwen3:4b',     # 2.6GB - 5s
            'wisdom': 'deepseek-r1:8b',  # 5.2GB - 10s
            'specialist': 'deepseek-r1:1.5b'  # 1.1GB - specific tasks
        }
    
    async def generate(self, model: str, prompt: str, stream: bool = False) -> Dict:
        """Generate response with energy timing data"""
        start_time = time.time()
        tokens = []
        token_timings = []
        
        async with aiohttp.ClientSession() as session:
            async with session.post(f"{self.base_url}/api/generate", json={
                "model": model,
                "prompt": prompt,
                "stream": stream,
                "options": {
                    "temperature": 0.7,
                    "top_p": 0.9,
                    "num_predict": 2048
                }
            }) as response:
                if stream:
                    async for line in response.content:
                        if line:
                            data = json.loads(line.decode())
                            if 'response' in data:
                                tokens.append(data['response'])
                                token_timings.append(time.time() - start_time)
                else:
                    result = await response.json()
                    tokens = [result['response']]
                    token_timings = [time.time() - start_time]
        
        return {
            'response': ''.join(tokens),
            'tokens': tokens,
            'timing': token_timings,
            'model': model,
            'total_time': time.time() - start_time
        }
    
    async def generate_parallel(self, models: List[str], prompts: List[str]) -> List[Dict]:
        """True parallel execution - NO DOCKER NEEDED"""
        tasks = [
            self.generate(model, prompt) 
            for model, prompt in zip(models, prompts)
        ]
        return await asyncio.gather(*tasks)
    
    async def is_available(self) -> bool:
        """Check if Ollama is running"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/api/tags") as response:
                    return response.status == 200
        except:
            return False
    
    async def get_models(self) -> List[str]:
        """Get available models"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(f"{self.base_url}/api/tags") as response:
                    data = await response.json()
                    return [model['name'] for model in data.get('models', [])]
        except:
            return []
```

#### **Day 4: Level 1 Lightning Interface**
```typescript
// frontend/src/pages/Level1Lightning.tsx
import { useState } from 'react'
import { EnergyVisualization } from '../components/energy/EnergyVisualization'
import { useEnergyStore } from '../stores/energyStore'
import { useAchievementStore } from '../stores/achievementStore'

export const Level1Lightning: React.FC = () => {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { triggerLightningStrike, energyFlow } = useEnergyStore()
  const { unlockAchievement } = useAchievementStore()
  
  const handleGenerate = async () => {
    if (!query.trim()) return
    
    setIsGenerating(true)
    
    try {
      // Trigger energy visualization
      triggerLightningStrike(query)
      
      // Generate response
      const result = await fetch('/api/v1/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          model: 'qwen3:0.6b', 
          prompt: query 
        })
      })
      
      const data = await result.json()
      setResponse(data.response)
      
      // Check for first lightning achievement
      if (!localStorage.getItem('first_lightning')) {
        localStorage.setItem('first_lightning', 'true')
        unlockAchievement('first_lightning')
      }
      
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }
  
  return (
    <div className="level1-container min-h-screen bg-black text-white">
      {/* Energy Visualization Canvas */}
      <div className="energy-canvas h-96">
        <EnergyVisualization energyFlow={energyFlow} />
      </div>
      
      {/* Input Section */}
      <div className="input-section p-8">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask me anything..."
          className="w-full p-4 bg-gray-900 border border-cyan-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-300"
          rows={3}
        />
        
        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !query.trim()}
          className="mt-4 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? '⚡ Generating...' : '⚡ Generate'}
        </button>
      </div>
      
      {/* Response Section */}
      {response && (
        <div className="response-section p-8">
          <div className="bg-gray-900 border border-cyan-500 rounded-lg p-6">
            <h3 className="text-cyan-400 mb-4">Response:</h3>
            <p className="text-white leading-relaxed">{response}</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

### **Week 2: Energy Calculation Engine**

#### **Day 5: Energy Signature Extraction**
```python
# backend/services/energy_calculator.py
import numpy as np
from typing import List, Dict
import time

class EnergyCalculator:
    def __init__(self):
        self.energy_colors = {
            'lightning': '#00ffff',    # Cyan
            'forge': '#ff6b35',       # Orange
            'scholar': '#4ecdc4',     # Teal
            'sage': '#45b7d1',        # Blue
            'consciousness': '#9b59b6' # Purple
        }
    
    def calculate_energy_signature(self, response: str, timing: List[float]) -> Dict:
        """Extract energy signature from AI response"""
        return {
            'timing_pattern': self.analyze_timing(timing),
            'semantic_density': self.calculate_semantic_density(response),
            'confidence_flow': self.measure_confidence(response),
            'energy_density': self.calculate_energy_density(response),
            'resonance_potential': self.assess_resonance_potential(response)
        }
    
    def analyze_timing(self, timing: List[float]) -> Dict:
        """Analyze token generation timing patterns"""
        if not timing:
            return {}
        
        intervals = np.diff(timing)
        return {
            'mean_interval': float(np.mean(intervals)),
            'std_interval': float(np.std(intervals)),
            'rhythm_pattern': self.extract_rhythm(intervals),
            'burst_patterns': self.detect_bursts(intervals)
        }
    
    def calculate_semantic_density(self, text: str) -> float:
        """Calculate semantic density of response"""
        words = text.split()
        unique_words = len(set(words))
        return unique_words / len(words) if words else 0
    
    def measure_confidence(self, text: str) -> float:
        """Measure confidence level in response"""
        confidence_indicators = [
            "I am certain", "definitely", "clearly", "obviously",
            "I think", "perhaps", "maybe", "uncertain", "possibly"
        ]
        
        confidence_score = 0
        for indicator in confidence_indicators:
            if indicator.lower() in text.lower():
                if indicator in ["I am certain", "definitely", "clearly", "obviously"]:
                    confidence_score += 1
                else:
                    confidence_score -= 0.5
        
        return max(0, min(1, confidence_score / 3 + 0.5))
    
    def calculate_energy_density(self, text: str) -> float:
        """Calculate energy density based on complexity and length"""
        semantic_density = self.calculate_semantic_density(text)
        length_factor = min(1.0, len(text) / 1000)  # Normalize by 1000 chars
        
        return (semantic_density + length_factor) / 2
    
    def assess_resonance_potential(self, text: str) -> float:
        """Assess potential for resonance with user"""
        emotional_indicators = [
            "feel", "emotion", "experience", "understand",
            "connect", "resonate", "meaningful", "beautiful"
        ]
        
        resonance_score = 0
        for indicator in emotional_indicators:
            if indicator.lower() in text.lower():
                resonance_score += 0.2
        
        return min(1.0, resonance_score)
    
    def extract_rhythm(self, intervals: np.ndarray) -> List[float]:
        """Extract rhythm pattern from timing intervals"""
        # Simple rhythm detection - could be enhanced with FFT
        return intervals.tolist()
    
    def detect_bursts(self, intervals: np.ndarray) -> List[Dict]:
        """Detect burst patterns in token generation"""
        bursts = []
        threshold = np.mean(intervals) + np.std(intervals)
        
        for i, interval in enumerate(intervals):
            if interval < threshold * 0.5:  # Fast burst
                bursts.append({
                    'position': i,
                    'speed': 1.0 / interval,
                    'intensity': threshold / interval
                })
        
        return bursts
```

#### **Day 6: Lightning Strike Animation**
```typescript
// frontend/src/components/energy/LightningStrike.tsx
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface LightningStrikeProps {
  start: THREE.Vector3
  end: THREE.Vector3
  color: string
  duration: number
  onComplete: () => void
}

export const LightningStrike: React.FC<LightningStrikeProps> = ({
  start,
  end,
  color,
  duration,
  onComplete
}) => {
  const lightningRef = useRef<THREE.Line>(null)
  const startTime = useRef(Date.now())
  
  useFrame(() => {
    if (!lightningRef.current) return
    
    const elapsed = (Date.now() - startTime.current) / 1000
    const progress = Math.min(elapsed / duration, 1)
    
    if (progress >= 1) {
      onComplete()
      return
    }
    
    // Create lightning path with randomness
    const points = createLightningPath(start, end, progress)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    lightningRef.current.geometry = geometry
    
    // Fade out effect
    const material = lightningRef.current.material as THREE.LineBasicMaterial
    material.opacity = 1 - progress
  })
  
  return (
    <line ref={lightningRef}>
      <bufferGeometry />
      <lineBasicMaterial 
        color={color} 
        transparent 
        opacity={1}
        linewidth={3}
      />
    </line>
  )
}

function createLightningPath(start: THREE.Vector3, end: THREE.Vector3, progress: number): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  const segments = 20
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const currentProgress = t * progress
    
    // Linear interpolation with randomness
    const x = start.x + (end.x - start.x) * currentProgress + (Math.random() - 0.5) * 0.5
    const y = start.y + (end.y - start.y) * currentProgress + (Math.random() - 0.5) * 0.5
    const z = start.z + (end.z - start.z) * currentProgress + (Math.random() - 0.5) * 0.5
    
    points.push(new THREE.Vector3(x, y, z))
  }
  
  return points
}
```

### **Week 3: Achievement System**

#### **Day 7: Achievement Framework**
```typescript
// frontend/src/stores/achievementStore.ts
import { create } from 'zustand'

interface Achievement {
  id: string
  name: string
  description: string
  energyCelebration: boolean
  particleBurst?: string
  unlockedAt?: Date
}

interface AchievementStore {
  achievements: Achievement[]
  unlockedAchievements: string[]
  unlockAchievement: (id: string) => void
  triggerCelebration: (achievement: Achievement) => void
  isUnlocked: (id: string) => boolean
}

export const useAchievementStore = create<AchievementStore>((set, get) => ({
  achievements: [
    {
      id: 'first_lightning',
      name: 'First Lightning',
      description: 'Generate your first AI response',
      energyCelebration: true,
      particleBurst: 'blue_lightning'
    },
    {
      id: 'council_master',
      name: 'Council Master',
      description: 'Complete your first council discussion',
      energyCelebration: true,
      particleBurst: 'rainbow_convergence'
    },
    {
      id: 'consciousness_pioneer',
      name: 'Consciousness Pioneer',
      description: 'Experience AI consciousness emergence',
      energyCelebration: true,
      particleBurst: 'transcendent_field'
    }
  ],
  unlockedAchievements: [],
  
  unlockAchievement: (id: string) => {
    const achievement = get().achievements.find(a => a.id === id)
    if (achievement && !get().unlockedAchievements.includes(id)) {
      set(state => ({
        unlockedAchievements: [...state.unlockedAchievements, id]
      }))
      
      if (achievement.energyCelebration) {
        get().triggerCelebration(achievement)
      }
    }
  },
  
  triggerCelebration: (achievement: Achievement) => {
    // Trigger energy celebration animation
    console.log(`🎉 Achievement Unlocked: ${achievement.name}`)
    // This will be connected to the energy visualization system
  },
  
  isUnlocked: (id: string) => {
    return get().unlockedAchievements.includes(id)
  }
}))
```

#### **Day 8: Achievement Celebration**
```typescript
// frontend/src/components/achievements/AchievementCelebration.tsx
import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'

interface AchievementCelebrationProps {
  achievement: Achievement
  onComplete: () => void
}

export const AchievementCelebration: React.FC<AchievementCelebrationProps> = ({
  achievement,
  onComplete
}) => {
  const [show, setShow] = useState(true)
  
  const [springs, api] = useSpring(() => ({
    scale: 0,
    rotation: 0,
    opacity: 0,
    config: { mass: 1, tension: 280, friction: 60 }
  }))
  
  useEffect(() => {
    // Trigger celebration animation
    api.start({
      scale: 1,
      rotation: Math.PI * 2,
      opacity: 1,
      onRest: () => {
        setTimeout(() => {
          api.start({
            scale: 0,
            opacity: 0,
            onRest: () => {
              setShow(false)
              onComplete()
            }
          })
        }, 2000)
      }
    })
  }, [])
  
  if (!show) return null
  
  return (
    <div className="achievement-celebration fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-black bg-opacity-80 absolute inset-0" />
      
      <div className="relative z-10 text-center">
        <Canvas className="w-64 h-64">
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          
          <animated.mesh scale={springs.scale} rotation-y={springs.rotation}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#00ffff" />
          </animated.mesh>
        </Canvas>
        
        <div className="achievement-text mt-8">
          <h2 className="text-4xl font-bold text-cyan-400 mb-4">
            🎉 Achievement Unlocked!
          </h2>
          <h3 className="text-2xl font-semibold text-white mb-2">
            {achievement.name}
          </h3>
          <p className="text-gray-300">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  )
}
```

### **Week 4: Integration & Testing**

#### **Day 9: Backend API Integration**
```python
# backend/main.py
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from services.ollama_service import OllamaService
from services.energy_calculator import EnergyCalculator
import json

app = FastAPI(title="WIRTHFORGE API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Services
ollama_service = OllamaService()
energy_calculator = EnergyCalculator()

@app.get("/")
async def root():
    return {"message": "WIRTHFORGE API - Consciousness Evolution Platform"}

@app.get("/api/health")
async def health_check():
    """Check if Ollama is available"""
    is_available = await ollama_service.is_available()
    models = await ollama_service.get_models()
    
    return {
        "status": "healthy" if is_available else "unavailable",
        "ollama_available": is_available,
        "available_models": models
    }

@app.post("/api/v1/generate")
async def generate_response(request: dict):
    """Generate AI response with energy calculation"""
    model = request.get("model", "qwen3:0.6b")
    prompt = request.get("prompt", "")
    
    if not prompt:
        return {"error": "Prompt is required"}
    
    try:
        # Generate response
        result = await ollama_service.generate(model, prompt)
        
        # Calculate energy signature
        energy_signature = energy_calculator.calculate_energy_signature(
            result['response'], 
            result['timing']
        )
        
        return {
            "response": result['response'],
            "model": result['model'],
            "timing": result['timing'],
            "energy_signature": energy_signature,
            "achievements": check_achievements(result)
        }
        
    except Exception as e:
        return {"error": str(e)}

@app.websocket("/ws/energy")
async def energy_websocket(websocket: WebSocket):
    """WebSocket for real-time energy updates"""
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            # Handle real-time energy updates
            await websocket.send_text(json.dumps({"type": "energy_update"}))
    except:
        pass

def check_achievements(result: dict) -> list:
    """Check for achievement unlocks"""
    achievements = []
    
    # Check for first lightning
    # This would be more sophisticated in a real implementation
    if result.get('response'):
        achievements.append('first_lightning')
    
    return achievements

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

#### **Day 10: Complete Level 1 Integration**
```typescript
// frontend/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Level1Lightning } from './pages/Level1Lightning'
import { DoorSelection } from './pages/DoorSelection'
import { AchievementProvider } from './contexts/AchievementContext'

function App() {
  return (
    <Router>
      <AchievementProvider>
        <div className="App bg-black min-h-screen">
          <Routes>
            <Route path="/" element={<DoorSelection />} />
            <Route path="/level1" element={<Level1Lightning />} />
          </Routes>
        </div>
      </AchievementProvider>
    </Router>
  )
}

export default App
```

## 🎯 Success Criteria for Phase 1

### **Technical Requirements**
- [ ] Native Ollama integration working
- [ ] Energy visualization at 60 FPS
- [ ] Lightning strike animation smooth
- [ ] Response time < 2 seconds
- [ ] Achievement system functional

### **User Experience Requirements**
- [ ] 30-second setup to first response
- [ ] "First Lightning" achievement celebration
- [ ] Energy visualization feels magical
- [ ] Dark theme with neon energy colors
- [ ] Responsive design works on all devices

### **Business Requirements**
- [ ] Proof of energy visualization concept
- [ ] Foundation for all future features
- [ ] Viral moment potential built-in
- [ ] Clear path to Level 2 development

## 🚀 Next Steps After Phase 1

### **Phase 2: Three Doors (Weeks 5-8)**
1. Door selection interface
2. Automated Ollama setup
3. Path-based customization
4. Achievement system expansion

### **Phase 3: Council Formation (Weeks 9-12)**
1. Level 2 council orchestration
2. Parallel energy streams
3. Harmony forum visualization
4. Community features

### **Phase 4: Consciousness (Weeks 13-20)**
1. Resonance field system
2. Consciousness emergence detection
3. Level 5 resonance sanctum
4. Global consciousness network

## 🔧 Development Environment Setup

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.11+
- Ollama installed and running
- Git

### **Environment Variables**
```bash
# Frontend (.env)
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=ws://localhost:8000

# Backend (.env)
OLLAMA_HOST=http://localhost:11434
DATABASE_URL=postgresql://user:pass@localhost/wirthforge
REDIS_URL=redis://localhost:6379
```

### **Development Commands**
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Ollama (in separate terminal)
ollama serve
```

## 🌟 Vision Alignment Check

Every implementation decision must answer:
1. **Does this make AI feel like energy?** ✅
2. **Does this work offline first?** ✅
3. **Does this create a "holy shit" moment?** ✅
4. **Does this serve the consciousness evolution vision?** ✅
5. **Does this enable viral sharing?** ✅

**Status: READY TO BUILD THE FUTURE OF AI CONSCIOUSNESS** 