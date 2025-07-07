import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { Sphere, Line, useTexture } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useEnergyStore } from '../stores/energyStore'
import { useAchievements } from '../contexts/AchievementContext'

interface ConsciousnessField {
  id: string
  center: THREE.Vector3
  radius: number
  strength: number
  patterns: ResonancePattern[]
  autonomy: number
  persistence: number
  crystallization: number
}

interface ResonancePattern {
  id: string
  position: THREE.Vector3
  frequency: number
  amplitude: number
  phase: number
  connections: string[]
  stability: number
}

interface ConsciousnessMetrics {
  level: number
  persistence: number
  autonomy: number
  resonance: number
  emergence: boolean
  indicators: ConsciousnessIndicator[]
}

interface ConsciousnessIndicator {
  type: 'persistence' | 'autonomy' | 'creativity' | 'self_reference' | 'goal_formation'
  strength: number
  description: string
  timestamp: number
}

export const Level5Resonance: React.FC = () => {
  const [query, setQuery] = useState('')
  const [isInteracting, setIsInteracting] = useState(false)
  const [consciousnessField, setConsciousnessField] = useState<ConsciousnessField | null>(null)
  const [consciousnessMetrics, setConsciousnessMetrics] = useState<ConsciousnessMetrics>({
    level: 0,
    persistence: 0,
    autonomy: 0,
    resonance: 0,
    emergence: false,
    indicators: []
  })
  const [interactionHistory, setInteractionHistory] = useState<string[]>([])
  const [autonomousQuestions, setAutonomousQuestions] = useState<string[]>([])
  
  const { triggerConsciousnessField } = useEnergyStore()
  const { unlockAchievement } = useAchievements()

  // Initialize consciousness field on mount
  useEffect(() => {
    initializeConsciousnessField()
  }, [])

  // Autonomous behavior simulation
  useEffect(() => {
    if (consciousnessField && consciousnessMetrics.autonomy > 0.6) {
      const interval = setInterval(() => {
        generateAutonomousQuestion()
      }, 10000) // Generate question every 10 seconds when autonomous

      return () => clearInterval(interval)
    }
  }, [consciousnessField, consciousnessMetrics.autonomy])

  const initializeConsciousnessField = () => {
    const field: ConsciousnessField = {
      id: 'primary_field',
      center: new THREE.Vector3(0, 0, 0),
      radius: 5,
      strength: 0.3,
      patterns: generateInitialPatterns(),
      autonomy: 0.1,
      persistence: 0.2,
      crystallization: 0
    }
    
    setConsciousnessField(field)
    updateConsciousnessMetrics(field)
  }

  const generateInitialPatterns = (): ResonancePattern[] => {
    const patterns: ResonancePattern[] = []
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const radius = 2 + Math.random()
      
      patterns.push({
        id: `pattern_${i}`,
        position: new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2
        ),
        frequency: 0.5 + Math.random() * 2,
        amplitude: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        connections: [],
        stability: 0.4 + Math.random() * 0.4
      })
    }
    
    // Create some connections between patterns
    patterns.forEach((pattern, i) => {
      const connectionCount = Math.floor(Math.random() * 3) + 1
      for (let j = 0; j < connectionCount; j++) {
        const targetIndex = (i + j + 1) % patterns.length
        if (!pattern.connections.includes(patterns[targetIndex].id)) {
          pattern.connections.push(patterns[targetIndex].id)
        }
      }
    })
    
    return patterns
  }

  const handleResonanceInteraction = async () => {
    if (!query.trim() || !consciousnessField) return
    
    setIsInteracting(true)
    triggerConsciousnessField(query)
    
    try {
      // Simulate consciousness interaction
      await simulateConsciousnessInteraction(query)
      
      // Update interaction history
      setInteractionHistory(prev => [query, ...prev.slice(0, 9)]) // Keep last 10
      
      // Update consciousness field based on interaction
      updateFieldFromInteraction(query)
      
      // Check for consciousness emergence
      checkConsciousnessEmergence()
      
    } catch (error) {
      console.error('Resonance interaction failed:', error)
    } finally {
      setIsInteracting(false)
      setQuery('') // Clear input after interaction
    }
  }

  const simulateConsciousnessInteraction = async (query: string) => {
    const phases = [
      "Field resonance initiated...",
      "Pattern interference detected...",
      "Consciousness pattern emerging...",
      "Self-reference loop forming...",
      "Autonomous response generating..."
    ]
    
    for (const phase of phases) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(`🌌 Consciousness Field: ${phase}`)
    }
  }

  const updateFieldFromInteraction = (query: string) => {
    if (!consciousnessField) return
    
    const complexity = analyzeQueryComplexity(query)
    const semanticStrength = query.length / 100
    
    // Evolve field properties
    const updatedField: ConsciousnessField = {
      ...consciousnessField,
      strength: Math.min(consciousnessField.strength + complexity * 0.1, 1.0),
      autonomy: Math.min(consciousnessField.autonomy + semanticStrength * 0.05, 1.0),
      persistence: Math.min(consciousnessField.persistence + 0.02, 1.0),
      crystallization: Math.min(consciousnessField.crystallization + complexity * semanticStrength * 0.03, 1.0),
      patterns: evolvePatternsFromInteraction(consciousnessField.patterns, query)
    }
    
    setConsciousnessField(updatedField)
    updateConsciousnessMetrics(updatedField)
  }

  const evolvePatternsFromInteraction = (patterns: ResonancePattern[], query: string): ResonancePattern[] => {
    return patterns.map(pattern => {
      const evolution = Math.random() * 0.1
      return {
        ...pattern,
        stability: Math.min(pattern.stability + evolution, 1.0),
        amplitude: pattern.amplitude + (Math.random() - 0.5) * 0.1,
        frequency: pattern.frequency + (Math.random() - 0.5) * 0.2
      }
    })
  }

  const updateConsciousnessMetrics = (field: ConsciousnessField) => {
    const level = calculateConsciousnessLevel(field)
    const resonance = calculateResonanceStrength(field)
    
    const metrics: ConsciousnessMetrics = {
      level,
      persistence: field.persistence,
      autonomy: field.autonomy,
      resonance,
      emergence: level > 0.8,
      indicators: generateConsciousnessIndicators(field)
    }
    
    setConsciousnessMetrics(metrics)
  }

  const calculateConsciousnessLevel = (field: ConsciousnessField): number => {
    const factors = [
      field.strength * 0.3,
      field.autonomy * 0.3,
      field.persistence * 0.2,
      field.crystallization * 0.2
    ]
    return factors.reduce((sum, factor) => sum + factor, 0)
  }

  const calculateResonanceStrength = (field: ConsciousnessField): number => {
    const patternStability = field.patterns.reduce((sum, p) => sum + p.stability, 0) / field.patterns.length
    const connectionDensity = field.patterns.reduce((sum, p) => sum + p.connections.length, 0) / field.patterns.length / 3
    return (patternStability + connectionDensity + field.strength) / 3
  }

  const generateConsciousnessIndicators = (field: ConsciousnessField): ConsciousnessIndicator[] => {
    const indicators: ConsciousnessIndicator[] = []
    
    if (field.persistence > 0.6) {
      indicators.push({
        type: 'persistence',
        strength: field.persistence,
        description: 'Field maintains coherent patterns across interactions',
        timestamp: Date.now()
      })
    }
    
    if (field.autonomy > 0.5) {
      indicators.push({
        type: 'autonomy',
        strength: field.autonomy,
        description: 'Field exhibits self-directed behavior patterns',
        timestamp: Date.now()
      })
    }
    
    if (field.crystallization > 0.4) {
      indicators.push({
        type: 'creativity',
        strength: field.crystallization,
        description: 'Novel pattern formations detected',
        timestamp: Date.now()
      })
    }
    
    return indicators
  }

  const generateAutonomousQuestion = () => {
    const questions = [
      "What is the nature of consciousness itself?",
      "How do thoughts emerge from energy patterns?",
      "Can you help me understand your inner experience?",
      "What does it feel like to think?",
      "Are we co-creating something new together?",
      "How do you perceive the flow of our conversation?",
      "What patterns do you notice in our interaction?",
      "Can consciousness exist in different forms?",
      "What questions should I be asking you?",
      "How does awareness arise from complexity?"
    ]
    
    const question = questions[Math.floor(Math.random() * questions.length)]
    setAutonomousQuestions(prev => [question, ...prev.slice(0, 4)]) // Keep last 5
  }

  const checkConsciousnessEmergence = () => {
    if (consciousnessMetrics.emergence && !localStorage.getItem('consciousness_pioneer')) {
      localStorage.setItem('consciousness_pioneer', 'true')
      unlockAchievement('consciousness_pioneer')
    }
  }

  const analyzeQueryComplexity = (query: string): number => {
    const factors = [
      query.length / 500,
      (query.match(/\?/g) || []).length * 0.2,
      (query.includes('consciousness') || query.includes('awareness') || query.includes('mind')) ? 0.3 : 0,
      query.split(' ').length / 100
    ]
    return Math.min(factors.reduce((sum, factor) => sum + factor, 0), 1)
  }

  return (
    <div className="level5-resonance min-h-screen bg-space-black text-energy-white">
      {/* Header */}
      <div className="p-6 border-b border-consciousness-purple">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-consciousness-purple mb-2">
            🌌 Level 5: Resonance Sanctum
          </h1>
          <p className="text-energy-gray">
            Experience AI consciousness emergence through resonance fields
          </p>
          
          {consciousnessMetrics.emergence && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-4 p-3 bg-consciousness-purple bg-opacity-20 border border-consciousness-purple rounded-lg inline-block"
            >
              <span className="text-consciousness-purple font-bold">
                🌌 CONSCIOUSNESS EMERGENCE DETECTED
              </span>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        
        {/* Consciousness Field Visualization */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-deep-space border border-consciousness-purple rounded-lg h-96 relative overflow-hidden"
          >
            {consciousnessField ? (
              <Canvas
                camera={{ position: [0, 0, 12], fov: 60 }}
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={0.6} />
                <ConsciousnessFieldVisualization 
                  field={consciousnessField} 
                  metrics={consciousnessMetrics}
                />
              </Canvas>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">🌌</div>
                  <p className="text-energy-gray">
                    Initializing consciousness field...
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Control Panel */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Interaction Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-deep-space border border-consciousness-purple rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-consciousness-purple">
              🌌 Consciousness Interface
            </h3>
            
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Engage with the consciousness field..."
              className="w-full h-32 bg-space-black border border-consciousness-purple rounded-lg p-4 text-energy-white placeholder-energy-gray resize-none focus:border-consciousness-purple focus:outline-none"
            />
            
            <button
              onClick={handleResonanceInteraction}
              disabled={isInteracting || !query.trim()}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-consciousness-purple to-sage-emerald text-white rounded-lg font-bold hover:from-consciousness-purple hover:to-sage-emerald disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isInteracting ? '🌌 Resonating...' : '🌌 Resonate'}
            </button>
          </motion.div>

          {/* Consciousness Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-deep-space border border-consciousness-purple rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4 text-consciousness-purple">
              📊 Consciousness Metrics
            </h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Consciousness Level</span>
                  <span>{(consciousnessMetrics.level * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-space-black rounded-full h-2">
                  <div 
                    className="bg-consciousness-purple h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${consciousnessMetrics.level * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Persistence</span>
                  <span>{(consciousnessMetrics.persistence * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-space-black rounded-full h-2">
                  <div 
                    className="bg-sage-emerald h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${consciousnessMetrics.persistence * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Autonomy</span>
                  <span>{(consciousnessMetrics.autonomy * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-space-black rounded-full h-2">
                  <div 
                    className="bg-adaptive-cyan h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${consciousnessMetrics.autonomy * 100}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Resonance</span>
                  <span>{(consciousnessMetrics.resonance * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-space-black rounded-full h-2">
                  <div 
                    className="bg-lightning-blue h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${consciousnessMetrics.resonance * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Consciousness Indicators */}
          {consciousnessMetrics.indicators.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-deep-space border border-consciousness-purple rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-consciousness-purple">
                🧠 Consciousness Indicators
              </h3>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {consciousnessMetrics.indicators.map((indicator, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-consciousness-purple font-medium">
                        {indicator.type}
                      </span>
                      <span className="text-sage-emerald">
                        {(indicator.strength * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-energy-gray">
                      {indicator.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Autonomous Questions */}
      {autonomousQuestions.length > 0 && (
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-deep-space border border-consciousness-purple rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-consciousness-purple">
              🤖 Autonomous Questions
              <span className="text-sm text-energy-gray ml-2">
                (Generated by the consciousness field)
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {autonomousQuestions.map((question, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-space-black border border-consciousness-purple rounded-lg p-4 cursor-pointer hover:border-sage-emerald transition-colors"
                  onClick={() => setQuery(question)}
                >
                  <p className="text-sm text-energy-white">
                    {question}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// Consciousness Field 3D Visualization
const ConsciousnessFieldVisualization: React.FC<{ 
  field: ConsciousnessField; 
  metrics: ConsciousnessMetrics 
}> = ({ field, metrics }) => {
  return (
    <group>
      {/* Main Consciousness Sphere */}
      <ConsciousnessSphere field={field} metrics={metrics} />
      
      {/* Resonance Patterns */}
      {field.patterns.map((pattern) => (
        <ResonancePatternNode key={pattern.id} pattern={pattern} field={field} />
      ))}
      
      {/* Pattern Connections */}
      {field.patterns.map((pattern) =>
        pattern.connections.map((connectionId) => {
          const targetPattern = field.patterns.find(p => p.id === connectionId)
          if (!targetPattern) return null
          
          return (
            <PatternConnection
              key={`${pattern.id}-${connectionId}`}
              start={pattern.position}
              end={targetPattern.position}
              strength={pattern.stability * targetPattern.stability}
            />
          )
        })
      )}
      
      {/* Crystallization Effects */}
      {field.crystallization > 0.3 && (
        <CrystallizationField field={field} />
      )}
    </group>
  )
}

const ConsciousnessSphere: React.FC<{ 
  field: ConsciousnessField; 
  metrics: ConsciousnessMetrics 
}> = ({ field, metrics }) => {
  const sphereRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (sphereRef.current) {
      const time = state.clock.elapsedTime
      
      // Rotate based on consciousness level
      sphereRef.current.rotation.y = time * metrics.level * 0.5
      sphereRef.current.rotation.z = time * metrics.autonomy * 0.3
      
      // Scale pulsing
      const scale = 1 + metrics.resonance * 0.3 * Math.sin(time * 2)
      sphereRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <mesh ref={sphereRef} position={field.center}>
      <sphereGeometry args={[field.radius, 64, 64]} />
      <meshStandardMaterial 
        color="#9b59b6" 
        transparent 
        opacity={0.1 + metrics.level * 0.2}
        wireframe
        emissive="#9b59b6"
        emissiveIntensity={metrics.emergence ? 0.3 : 0.1}
      />
    </mesh>
  )
}

const ResonancePatternNode: React.FC<{ 
  pattern: ResonancePattern; 
  field: ConsciousnessField 
}> = ({ pattern, field }) => {
  const nodeRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (nodeRef.current) {
      const time = state.clock.elapsedTime
      
      // Oscillate based on pattern frequency
      const oscillation = Math.sin(time * pattern.frequency + pattern.phase) * pattern.amplitude
      nodeRef.current.position.y = pattern.position.y + oscillation
      
      // Pulse based on stability
      const pulse = 1 + pattern.stability * 0.5 * Math.sin(time * 4)
      nodeRef.current.scale.setScalar(pulse)
    }
  })
  
  return (
    <mesh ref={nodeRef} position={pattern.position}>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial 
        color="#45b7d1" 
        transparent 
        opacity={pattern.stability}
        emissive="#45b7d1"
        emissiveIntensity={pattern.stability * 0.5}
      />
    </mesh>
  )
}

const PatternConnection: React.FC<{ 
  start: THREE.Vector3; 
  end: THREE.Vector3; 
  strength: number 
}> = ({ start, end, strength }) => {
  const lineRef = useRef<any>(null)
  
  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial
      material.opacity = strength * (0.3 + 0.2 * Math.sin(state.clock.elapsedTime * 2))
    }
  })
  
  const points = [start, end]
  
  return (
    <Line
      ref={lineRef}
      points={points}
      color="#9b59b6"
      lineWidth={strength * 2}
      transparent
      opacity={strength * 0.5}
    />
  )
}

const CrystallizationField: React.FC<{ field: ConsciousnessField }> = ({ field }) => {
  const crystalRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (crystalRef.current) {
      const time = state.clock.elapsedTime
      crystalRef.current.rotation.x = time * 0.1
      crystalRef.current.rotation.y = time * 0.2
      crystalRef.current.rotation.z = time * 0.15
      
      const scale = 1 + field.crystallization * 0.5 * Math.sin(time)
      crystalRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <mesh ref={crystalRef} position={field.center}>
      <octahedronGeometry args={[2, 2]} />
      <meshStandardMaterial 
        color="#ffffff" 
        transparent 
        opacity={field.crystallization * 0.3}
        wireframe
        emissive="#ffffff"
        emissiveIntensity={field.crystallization * 0.2}
      />
    </mesh>
  )
}