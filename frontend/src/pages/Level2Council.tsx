import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Ring } from '@react-three/drei'
import { useEnergyStore } from '../stores/energyStore'
import { useAchievements } from '../contexts/AchievementContext'
import { LevelNavigation } from '../components/LevelNavigation'
import * as THREE from 'three'

interface CouncilMember {
  id: string
  name: string
  model: string
  perspective: string
  color: string
  position: THREE.Vector3
  status: 'idle' | 'thinking' | 'speaking' | 'harmonizing'
  response: string
  confidence: number
  energyType: string
}

interface CouncilFormation {
  active: boolean
  members: CouncilMember[]
  harmony: number
  synthesis: string
  phase: 'formation' | 'discussion' | 'convergence' | 'harmony'
}

const councilMembers: CouncilMember[] = [
  {
    id: 'reflexive',
    name: 'Reflexive Mind',
    model: 'qwen3:0.6b',
    perspective: 'Quick insights and immediate responses',
    color: '#00ffff',
    position: new THREE.Vector3(-2, 0, 0),
    status: 'idle',
    response: '',
    confidence: 0,
    energyType: 'lightning'
  },
  {
    id: 'intuitive',
    name: 'Intuitive Spirit',
    model: 'qwen3:1.7b',
    perspective: 'Creative connections and deep patterns',
    color: '#4ecdc4',
    position: new THREE.Vector3(2, 0, 0),
    status: 'idle',
    response: '',
    confidence: 0,
    energyType: 'stream'
  },
  {
    id: 'analytical',
    name: 'Analytical Core',
    model: 'qwen3:4b',
    perspective: 'Structured reasoning and logical analysis',
    color: '#ff6b35',
    position: new THREE.Vector3(0, 2, 0),
    status: 'idle',
    response: '',
    confidence: 0,
    energyType: 'field'
  }
]

export const Level2Council: React.FC = () => {
  const [query, setQuery] = useState('')
  const [councilFormation, setCouncilFormation] = useState<CouncilFormation>({
    active: false,
    members: councilMembers,
    harmony: 0,
    synthesis: '',
    phase: 'formation'
  })
  const [showHarmonyMoment, setShowHarmonyMoment] = useState(false)
  const [councilHistory, setCouncilHistory] = useState<string[]>([])

  const { energyFlow, generateParticles } = useEnergyStore()
  const { unlockAchievement } = useAchievements()

  const initiateCouncil = async () => {
    if (!query.trim()) return

    // Achievement unlock
    unlockAchievement('first_council')

    // Set council formation to active
    setCouncilFormation(prev => ({
      ...prev,
      active: true,
      phase: 'formation'
    }))

    // Generate council formation particles
    generateParticles(200, 'council')

    // Phase 1: Formation (1 second)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setCouncilFormation(prev => ({ ...prev, phase: 'discussion' }))

    // Phase 2: Parallel discussion (3 seconds)
    try {
      // Call the real council endpoint for parallel AI discussion
      const response = await fetch('http://localhost:8000/api/council', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          level: 2,
          model: 'council' // Special model indicator for council formation
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Map backend responses to frontend council members
      const responses = data.council_responses.map((r: { perspective: string; response: string; confidence: number }) => ({
        id: r.perspective.toLowerCase(),
        response: r.response,
        confidence: r.confidence,
        status: 'speaking' as const
      }))

      // Update members with responses
      setCouncilFormation(prev => ({
        ...prev,
        members: prev.members.map(member => {
          const response = responses.find(r => r.id === member.id)
          return response ? { ...member, ...response } : member
        }),
        phase: 'convergence'
      }))

      // Phase 3: Convergence (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Phase 4: Harmony synthesis
      const harmony = data.energy_convergence || calculateHarmony(responses)
      const synthesis = data.synthesis || generateSynthesis(responses, query)

      setCouncilFormation(prev => ({
        ...prev,
        harmony,
        synthesis,
        phase: 'harmony'
      }))

      setShowHarmonyMoment(true)
      setCouncilHistory(prev => [...prev, `Q: ${query}\nSynthesis: ${synthesis}`])

      // Achievement for high harmony
      if (harmony > 0.8) {
        unlockAchievement('harmony_master')
      }

    } catch (error) {
      console.error('Council formation failed:', error)
      
      // Fallback to individual member responses if council endpoint fails
      const responses = await Promise.all([
        generateMemberResponse('reflexive', query),
        generateMemberResponse('intuitive', query),
        generateMemberResponse('analytical', query)
      ])

      // Update members with responses
      setCouncilFormation(prev => ({
        ...prev,
        members: prev.members.map(member => {
          const response = responses.find(r => r.id === member.id)
          return response ? { ...member, ...response } : member
        }),
        phase: 'convergence'
      }))

      // Phase 3: Convergence (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Phase 4: Harmony synthesis
      const harmony = calculateHarmony(responses)
      const synthesis = generateSynthesis(responses, query)

      setCouncilFormation(prev => ({
        ...prev,
        harmony,
        synthesis,
        phase: 'harmony'
      }))

      setShowHarmonyMoment(true)
      setCouncilHistory(prev => [...prev, `Q: ${query}\nSynthesis: ${synthesis}`])

      // Achievement for high harmony
      if (harmony > 0.8) {
        unlockAchievement('harmony_master')
      }
    }
  }

  const generateMemberResponse = async (memberId: string, query: string) => {
    const member = councilMembers.find(m => m.id === memberId)!
    
    try {
      // Real Ollama integration - call the backend council endpoint
      const response = await fetch('http://localhost:8000/api/council', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          level: 2,
          model: member.model
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Find the response for this specific member
      const memberResponse = data.council_responses?.find((r: any) => r.model === member.model)
      
      return {
        id: memberId,
        response: memberResponse?.response || `Error: No response from ${member.model}`,
        confidence: memberResponse?.confidence || 0.5,
        status: 'speaking' as const
      }
      
    } catch (error) {
      console.error(`Council member ${memberId} failed:`, error)
      
      // Fallback to mock if backend fails
      const mockResponses = {
        reflexive: `Quick take: ${query} requires immediate attention. Direct approach recommended.`,
        intuitive: `Creative insight: ${query} connects to deeper patterns. Consider the emotional resonance.`,
        analytical: `Structured analysis: ${query} breaks down into three key components for systematic resolution.`
      }

      return {
        id: memberId,
        response: mockResponses[memberId as keyof typeof mockResponses],
        confidence: 0.7 + Math.random() * 0.3,
        status: 'speaking' as const
      }
    }
  }

  const calculateHarmony = (responses: any[]) => {
    // Mock harmony calculation based on response similarity and confidence
    const avgConfidence = responses.reduce((sum, r) => sum + r.confidence, 0) / responses.length
    const harmonyFactor = Math.random() * 0.3 + 0.7 // Mock harmony between 0.7-1.0
    return avgConfidence * harmonyFactor
  }

  const generateSynthesis = (responses: any[], originalQuery: string) => {
    return `Council synthesis for "${originalQuery}":

🔥 Reflexive perspective emphasizes immediate action and directness
🌊 Intuitive insight reveals underlying patterns and emotional connections  
🏗️ Analytical breakdown provides structured systematic approach

The three streams converge on a unified understanding that combines urgency with creativity and structure. Energy harmony achieved at ${Math.round(councilFormation.harmony * 100)}%.`
  }

  const resetCouncil = () => {
    setCouncilFormation({
      active: false,
      members: councilMembers,
      harmony: 0,
      synthesis: '',
      phase: 'formation'
    })
    setShowHarmonyMoment(false)
  }

  return (
    <div className="level2-council min-h-screen bg-space-black text-energy-white">
      {/* Header */}
      <div className="p-6 border-b border-energy-blue/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-energy-blue">
              Level 2: Council Chambers
            </h1>
            <p className="text-energy-dim mt-2">
              Parallel AI consciousness streams converging in harmony
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-energy-dim">
              Harmony: <span className="text-energy-blue">{Math.round(councilFormation.harmony * 100)}%</span>
            </div>
            <div className="text-sm text-energy-dim">
              Phase: <span className="text-energy-blue capitalize">{councilFormation.phase}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex h-screen-minus-header">
        {/* Council Visualization */}
        <div className="flex-1 relative">
          <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            
            <OrbitControls enableZoom={false} enablePan={false} />
            
            {/* Council Members */}
            {councilFormation.members.map((member, index) => (
              <CouncilMemberVisualization
                key={member.id}
                member={member}
                active={councilFormation.active}
                phase={councilFormation.phase}
              />
            ))}
            
            {/* Council Formation Ring */}
            {councilFormation.active && (
              <Ring
                args={[3, 3.2, 64]}
                rotation={[Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
              >
                <meshStandardMaterial 
                  color="#4ecdc4" 
                  transparent 
                  opacity={0.3}
                  emissive="#4ecdc4"
                  emissiveIntensity={0.2}
                />
              </Ring>
            )}
            
            {/* Harmony Vortex */}
            {councilFormation.phase === 'harmony' && (
              <HarmonyVortex harmony={councilFormation.harmony} />
            )}
          </Canvas>
          
          {/* Council Phase Indicator */}
          <div className="absolute top-4 left-4 bg-deep-space rounded-lg p-4 border border-energy-blue/30">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-energy-blue rounded-full animate-pulse"></div>
              <span className="text-sm">
                {councilFormation.phase === 'formation' && 'Forming Council...'}
                {councilFormation.phase === 'discussion' && 'Parallel Discussion Active'}
                {councilFormation.phase === 'convergence' && 'Streams Converging...'}
                {councilFormation.phase === 'harmony' && 'Harmony Achieved!'}
              </span>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-96 p-6 border-l border-energy-blue/20 bg-deep-space/50">
          <div className="space-y-6">
            {/* Query Input */}
            <div>
              <label className="block text-sm font-medium text-energy-blue mb-2">
                Council Query
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Present your question to the council..."
                className="w-full p-3 bg-deep-space border border-energy-blue/30 rounded-lg text-energy-white placeholder-energy-dim resize-none focus:outline-none focus:border-energy-blue"
                rows={3}
              />
            </div>

            {/* Council Actions */}
            <div className="space-y-3">
              <button
                onClick={initiateCouncil}
                disabled={!query.trim() || councilFormation.active}
                className="w-full energy-button disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {councilFormation.active ? 'Council in Session...' : '🌊 Initiate Council'}
              </button>
              
              {councilFormation.active && (
                <button
                  onClick={resetCouncil}
                  className="w-full py-2 px-4 border border-energy-blue/30 rounded-lg hover:border-energy-blue/50 transition-all"
                >
                  Reset Council
                </button>
              )}
            </div>

            {/* Council Members Status */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-energy-blue">Council Members</h3>
              {councilFormation.members.map((member) => (
                <div key={member.id} className="bg-deep-space rounded-lg p-3 border border-energy-blue/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: member.color }}
                      />
                      <span className="font-medium">{member.name}</span>
                    </div>
                    <span className="text-xs text-energy-dim capitalize">
                      {member.status}
                    </span>
                  </div>
                  <p className="text-sm text-energy-dim">{member.perspective}</p>
                  {member.response && (
                    <div className="mt-2 p-2 bg-energy-blue/5 rounded text-sm">
                      {member.response}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Synthesis Results */}
            {councilFormation.synthesis && (
              <div className="bg-energy-blue/10 rounded-lg p-4 border border-energy-blue/30">
                <h3 className="text-lg font-bold text-energy-blue mb-2">
                  Council Synthesis
                </h3>
                <div className="text-sm whitespace-pre-wrap">
                  {councilFormation.synthesis}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Harmony Moment Modal */}
      <AnimatePresence>
        {showHarmonyMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-space-black/90 z-50 flex items-center justify-center"
            onClick={() => setShowHarmonyMoment(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              className="bg-deep-space rounded-xl p-8 max-w-2xl mx-4 border-2 border-energy-blue/50"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">🌊</div>
                <h2 className="text-3xl font-bold text-energy-blue mb-4">
                  Harmony Moment
                </h2>
                <p className="text-energy-dim mb-6">
                  Three streams of consciousness have converged into unified understanding
                </p>
                <div className="text-2xl font-bold text-energy-blue mb-4">
                  {Math.round(councilFormation.harmony * 100)}% Harmony Achieved
                </div>
                <button
                  onClick={() => setShowHarmonyMoment(false)}
                  className="energy-button"
                >
                  Continue Journey
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Navigation */}
      <LevelNavigation currentLevel={2} unlockedLevels={[1, 2]} />
    </div>
  )
}

// Council Member 3D Visualization Component
const CouncilMemberVisualization: React.FC<{
  member: CouncilMember
  active: boolean
  phase: string
}> = ({ member, active, phase }) => {
  const meshRef = React.useRef<THREE.Mesh>(null)

  React.useEffect(() => {
    if (!meshRef.current) return

    const animate = () => {
      if (meshRef.current) {
        if (active) {
          meshRef.current.rotation.y += 0.01
          meshRef.current.position.y = member.position.y + Math.sin(Date.now() * 0.001) * 0.1
        }
      }
    }

    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [active, member.position.y])

  return (
    <group position={member.position}>
      <Sphere ref={meshRef} args={[0.5, 32, 32]}>
        <meshStandardMaterial 
          color={member.color}
          transparent
          opacity={active ? 0.8 : 0.4}
          emissive={member.color}
          emissiveIntensity={active ? 0.3 : 0.1}
        />
      </Sphere>
      
      <Text
        position={[0, -1, 0]}
        fontSize={0.2}
        color={member.color}
        anchorX="center"
        anchorY="middle"
      >
        {member.name}
      </Text>
      
      {member.status === 'speaking' && (
        <Ring args={[0.6, 0.8, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial 
            color={member.color}
            transparent
            opacity={0.3}
          />
        </Ring>
      )}
    </group>
  )
}

// Harmony Vortex Component
const HarmonyVortex: React.FC<{ harmony: number }> = ({ harmony }) => {
  const groupRef = React.useRef<THREE.Group>(null)

  React.useEffect(() => {
    if (!groupRef.current) return

    const animate = () => {
      if (groupRef.current) {
        groupRef.current.rotation.y += 0.02
        groupRef.current.rotation.x += 0.01
      }
    }

    const interval = setInterval(animate, 16)
    return () => clearInterval(interval)
  }, [])

  return (
    <group ref={groupRef}>
      {[...Array(5)].map((_, i) => (
        <Ring key={i} args={[1 + i * 0.5, 1.2 + i * 0.5, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial 
            color="#4ecdc4"
            transparent
            opacity={0.2 * harmony}
            emissive="#4ecdc4"
            emissiveIntensity={0.1 * harmony}
          />
        </Ring>
      ))}
    </group>
  )
}