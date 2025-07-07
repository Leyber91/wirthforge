import { useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import * as THREE from 'three'
import { Sphere, Box, Line } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useEnergyStore } from '../stores/energyStore'
import { useAchievements } from '../contexts/AchievementContext'

interface ArchitectDesign {
  topology: 'star' | 'mesh' | 'chain' | 'hybrid'
  workflow: WorkflowStep[]
  resourceAllocation: ResourceAllocation
  adaptations: Adaptation[]
}

interface WorkflowStep {
  id: string
  type: 'process' | 'decision' | 'synthesis'
  position: THREE.Vector3
  connections: string[]
  status: 'pending' | 'active' | 'complete'
}

interface ResourceAllocation {
  cpu: number
  memory: number
  models: string[]
  priority: 'speed' | 'quality' | 'balance'
}

interface Adaptation {
  timestamp: number
  reason: string
  change: string
  improvement: number
}

export const Level4Adaptive: React.FC = () => {
  const [query, setQuery] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [architectDesign, setArchitectDesign] = useState<ArchitectDesign | null>(null)
  const [adaptationLog, setAdaptationLog] = useState<Adaptation[]>([])
  const [currentTopology, setCurrentTopology] = useState<'star' | 'mesh' | 'chain' | 'hybrid'>('star')
  
  const { triggerAdaptiveField } = useEnergyStore()
  const { unlockAchievement } = useAchievements()

  const handleAdaptiveGeneration = async () => {
    if (!query.trim()) return
    
    setIsRunning(true)
    triggerAdaptiveField(query)
    
    try {
      // Simulate architect AI analysis
      await simulateArchitectAnalysis()
      
      // Generate dynamic workflow
      const design = await generateDynamicWorkflow(query)
      setArchitectDesign(design)
      
      // Execute adaptive workflow
      await executeAdaptiveWorkflow(design)
      
      // Check for achievements
      if (!localStorage.getItem('adaptive_master')) {
        localStorage.setItem('adaptive_master', 'true')
        unlockAchievement('adaptive_master')
      }
      
    } catch (error) {
      console.error('Adaptive generation failed:', error)
    } finally {
      setIsRunning(false)
    }
  }

  const simulateArchitectAnalysis = async () => {
    const phases = [
      "Analyzing query complexity...",
      "Detecting optimal topology...", 
      "Calculating resource requirements...",
      "Designing adaptive workflow...",
      "Initializing consciousness field..."
    ]
    
    for (const phase of phases) {
      await new Promise(resolve => setTimeout(resolve, 800))
      console.log(`🧬 Architect AI: ${phase}`)
    }
  }

  const generateDynamicWorkflow = async (query: string): Promise<ArchitectDesign> => {
    // Simulate dynamic workflow generation based on query analysis
    const complexity = analyzeQueryComplexity(query)
    const topology = selectOptimalTopology(complexity)
    
    const workflow: WorkflowStep[] = []
    const positions = generateTopologyPositions(topology, 5)
    
    positions.forEach((pos, i) => {
      workflow.push({
        id: `step_${i}`,
        type: i === 0 ? 'process' : i === positions.length - 1 ? 'synthesis' : 'decision',
        position: pos,
        connections: generateConnections(i, positions.length, topology),
        status: 'pending'
      })
    })
    
    return {
      topology,
      workflow,
      resourceAllocation: {
        cpu: Math.random() * 100,
        memory: Math.random() * 16000,
        models: ['qwen3:1.7b', 'qwen3:4b', 'deepseek-r1:8b'],
        priority: complexity > 0.7 ? 'quality' : complexity > 0.4 ? 'balance' : 'speed'
      },
      adaptations: []
    }
  }

  const executeAdaptiveWorkflow = async (design: ArchitectDesign) => {
    for (let i = 0; i < design.workflow.length; i++) {
      const step = design.workflow[i]
      
      // Update step status
      setArchitectDesign(prev => prev ? {
        ...prev,
        workflow: prev.workflow.map(s => 
          s.id === step.id ? {...s, status: 'active'} : s
        )
      } : null)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Complete step
      setArchitectDesign(prev => prev ? {
        ...prev,
        workflow: prev.workflow.map(s => 
          s.id === step.id ? {...s, status: 'complete'} : s
        )
      } : null)
      
      // Simulate adaptations
      if (Math.random() > 0.6) {
        const adaptation: Adaptation = {
          timestamp: Date.now(),
          reason: getAdaptationReason(),
          change: getAdaptationChange(),
          improvement: Math.random() * 30 + 10
        }
        
        setAdaptationLog(prev => [...prev, adaptation])
      }
    }
  }

  const analyzeQueryComplexity = (query: string): number => {
    const factors = [
      query.length / 500,
      (query.match(/\?/g) || []).length * 0.2,
      (query.includes('why') || query.includes('how') || query.includes('what')) ? 0.3 : 0,
      query.split(' ').length / 100
    ]
    return Math.min(factors.reduce((sum, factor) => sum + factor, 0), 1)
  }

  const selectOptimalTopology = (complexity: number): 'star' | 'mesh' | 'chain' | 'hybrid' => {
    if (complexity < 0.3) return 'star'
    if (complexity < 0.6) return 'chain'
    if (complexity < 0.8) return 'mesh'
    return 'hybrid'
  }

  const generateTopologyPositions = (topology: string, count: number): THREE.Vector3[] => {
    const positions: THREE.Vector3[] = []
    
    switch (topology) {
      case 'star':
        positions.push(new THREE.Vector3(0, 0, 0)) // Center
        for (let i = 1; i < count; i++) {
          const angle = (i - 1) * (2 * Math.PI) / (count - 1)
          positions.push(new THREE.Vector3(
            Math.cos(angle) * 3,
            Math.sin(angle) * 3,
            0
          ))
        }
        break
        
      case 'chain':
        for (let i = 0; i < count; i++) {
          positions.push(new THREE.Vector3(i * 2 - (count - 1), 0, 0))
        }
        break
        
      case 'mesh':
        for (let i = 0; i < count; i++) {
          positions.push(new THREE.Vector3(
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 6,
            (Math.random() - 0.5) * 2
          ))
        }
        break
        
      case 'hybrid':
        // Complex hybrid topology
        for (let i = 0; i < count; i++) {
          const layer = Math.floor(i / 2)
          const angle = (i % 2) * Math.PI + layer * 0.5
          positions.push(new THREE.Vector3(
            Math.cos(angle) * (2 + layer),
            Math.sin(angle) * (2 + layer),
            layer * 0.5
          ))
        }
        break
    }
    
    return positions
  }

  const generateConnections = (index: number, total: number, topology: string): string[] => {
    const connections: string[] = []
    
    switch (topology) {
      case 'star':
        if (index === 0) {
          // Center connects to all
          for (let i = 1; i < total; i++) {
            connections.push(`step_${i}`)
          }
        } else {
          // Outer nodes connect to center
          connections.push('step_0')
        }
        break
        
      case 'chain':
        if (index > 0) connections.push(`step_${index - 1}`)
        if (index < total - 1) connections.push(`step_${index + 1}`)
        break
        
      case 'mesh':
        // Full mesh - connect to 2-3 random others
        const connectionCount = Math.floor(Math.random() * 2) + 2
        for (let i = 0; i < connectionCount; i++) {
          const target = Math.floor(Math.random() * total)
          if (target !== index) {
            connections.push(`step_${target}`)
          }
        }
        break
        
      case 'hybrid':
        // Complex hybrid connections
        const layer = Math.floor(index / 2)
        if (layer > 0) connections.push(`step_${index - 2}`)
        if (layer < Math.floor((total - 1) / 2)) connections.push(`step_${index + 2}`)
        if (index % 2 === 0 && index + 1 < total) connections.push(`step_${index + 1}`)
        break
    }
    
    return connections
  }

  const getAdaptationReason = (): string => {
    const reasons = [
      "Resource bottleneck detected",
      "Improved pathway discovered", 
      "Parallel optimization opportunity",
      "Energy efficiency improvement",
      "Consciousness resonance enhancement"
    ]
    return reasons[Math.floor(Math.random() * reasons.length)]
  }

  const getAdaptationChange = (): string => {
    const changes = [
      "Topology reconfiguration",
      "Resource reallocation",
      "Pipeline optimization",
      "Model switching",
      "Pathway restructuring"
    ]
    return changes[Math.floor(Math.random() * changes.length)]
  }

  return (
    <div className="level4-adaptive min-h-screen bg-space-black text-energy-white">
      {/* Header */}
      <div className="p-6 border-b border-energy-glow">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-adaptive-cyan mb-2">
            🧬 Level 4: Adaptive Fields
          </h1>
          <p className="text-energy-gray">
            Watch the Architect AI design dynamic workflows in real-time
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-deep-space border border-adaptive-cyan rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-adaptive-cyan">
              🧬 Architect Interface
            </h3>
            
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your complex challenge..."
              className="w-full h-32 bg-space-black border border-adaptive-cyan rounded-lg p-4 text-energy-white placeholder-energy-gray resize-none focus:border-adaptive-cyan focus:outline-none"
            />
            
            <button
              onClick={handleAdaptiveGeneration}
              disabled={isRunning || !query.trim()}
              className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-adaptive-cyan to-sage-emerald text-white rounded-lg font-bold hover:from-adaptive-cyan hover:to-sage-emerald disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isRunning ? '🧬 Architect Designing...' : '🧬 Invoke Architect'}
            </button>
          </motion.div>

          {/* Resource Monitor */}
          {architectDesign && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-deep-space border border-adaptive-cyan rounded-lg p-6"
            >
              <h3 className="text-lg font-semibold mb-4 text-adaptive-cyan">
                📊 Resource Allocation
              </h3>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU Usage</span>
                    <span>{architectDesign.resourceAllocation.cpu.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-space-black rounded-full h-2">
                    <div 
                      className="bg-adaptive-cyan h-2 rounded-full transition-all duration-500"
                      style={{ width: `${architectDesign.resourceAllocation.cpu}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Memory</span>
                    <span>{(architectDesign.resourceAllocation.memory / 1000).toFixed(1)}GB</span>
                  </div>
                  <div className="w-full bg-space-black rounded-full h-2">
                    <div 
                      className="bg-sage-emerald h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(architectDesign.resourceAllocation.memory / 160)}%` }}
                    />
                  </div>
                </div>
                
                <div className="text-sm">
                  <span className="text-energy-gray">Priority: </span>
                  <span className="text-adaptive-cyan font-semibold">
                    {architectDesign.resourceAllocation.priority}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 3D Visualization */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-deep-space border border-adaptive-cyan rounded-lg h-96 relative overflow-hidden"
          >
            {architectDesign ? (
              <Canvas
                camera={{ position: [0, 0, 10], fov: 60 }}
                style={{ background: 'transparent' }}
              >
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <AdaptiveFieldVisualization design={architectDesign} />
              </Canvas>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-6xl mb-4">🧬</div>
                  <p className="text-energy-gray">
                    Waiting for Architect AI to design workflow...
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Adaptation Log */}
      {adaptationLog.length > 0 && (
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-deep-space border border-adaptive-cyan rounded-lg p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-adaptive-cyan">
              🔄 Real-time Adaptations
            </h3>
            
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {adaptationLog.map((adaptation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-space-black border border-adaptive-cyan rounded-lg p-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-adaptive-cyan font-semibold">
                        {adaptation.reason}
                      </p>
                      <p className="text-xs text-energy-gray">
                        {adaptation.change}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sage-emerald font-bold">
                        +{adaptation.improvement.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

// 3D Visualization Component
const AdaptiveFieldVisualization: React.FC<{ design: ArchitectDesign }> = ({ design }) => {
  return (
    <group>
      {/* Workflow Nodes */}
      {design.workflow.map((step, index) => (
        <WorkflowNode key={step.id} step={step} />
      ))}
      
      {/* Connections */}
      {design.workflow.map((step) =>
        step.connections.map((connectionId) => {
          const targetStep = design.workflow.find(s => s.id === connectionId)
          if (!targetStep) return null
          
          return (
            <Connection
              key={`${step.id}-${connectionId}`}
              start={step.position}
              end={targetStep.position}
              active={step.status === 'active' || targetStep.status === 'active'}
            />
          )
        })
      )}
      
      {/* Central Field Effect */}
      <AdaptiveFieldEffect topology={design.topology} />
    </group>
  )
}

const WorkflowNode: React.FC<{ step: WorkflowStep }> = ({ step }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      
      if (step.status === 'active') {
        meshRef.current.rotation.y = time * 2
        meshRef.current.scale.setScalar(1.2 + 0.2 * Math.sin(time * 4))
      } else if (step.status === 'complete') {
        meshRef.current.rotation.y = time * 0.5
      }
    }
  })
  
  const getColor = () => {
    switch (step.status) {
      case 'active': return '#45b7d1'
      case 'complete': return '#2ecc71'
      default: return '#7f8c8d'
    }
  }
  
  const getGeometry = () => {
    switch (step.type) {
      case 'process': return <Box args={[0.8, 0.8, 0.8]} />
      case 'decision': return <Sphere args={[0.5, 16, 16]} />
      case 'synthesis': return <Box args={[1.2, 0.6, 0.6]} />
      default: return <Sphere args={[0.4, 16, 16]} />
    }
  }
  
  return (
    <mesh ref={meshRef} position={step.position}>
      {getGeometry()}
      <meshStandardMaterial 
        color={getColor()} 
        transparent 
        opacity={step.status === 'pending' ? 0.4 : 0.8}
        emissive={step.status === 'active' ? getColor() : '#000000'}
        emissiveIntensity={step.status === 'active' ? 0.3 : 0}
      />
    </mesh>
  )
}

const Connection: React.FC<{ start: THREE.Vector3; end: THREE.Vector3; active: boolean }> = ({ 
  start, 
  end, 
  active 
}) => {
  const points = [start, end]
  
  return (
    <Line
      points={points}
      color={active ? "#45b7d1" : "#444"}
      lineWidth={active ? 3 : 1}
      transparent
      opacity={active ? 0.8 : 0.4}
    />
  )
}

const AdaptiveFieldEffect: React.FC<{ topology: string }> = ({ topology }) => {
  const fieldRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (fieldRef.current) {
      const time = state.clock.elapsedTime
      fieldRef.current.rotation.y = time * 0.1
      fieldRef.current.rotation.z = time * 0.05
      
      const scale = 1 + 0.1 * Math.sin(time * 0.8)
      fieldRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <mesh ref={fieldRef}>
      <sphereGeometry args={[8, 32, 32]} />
      <meshStandardMaterial 
        color="#45b7d1" 
        transparent 
        opacity={0.05}
        wireframe
      />
    </mesh>
  )
}