import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Sphere, Box, Cylinder, Line } from '@react-three/drei'
import { useEnergyStore } from '../stores/energyStore'
import { useAchievements } from '../contexts/AchievementContext'
import { LevelNavigation } from '../components/LevelNavigation'
import * as THREE from 'three'

interface ArchitectureSeed {
  id: string
  query: string
  mode: 'branching' | 'interactive' | 'hybrid'
  growth: number
  structure: StructureNode[]
  energy: number
  complexity: number
}

interface StructureNode {
  id: string
  position: THREE.Vector3
  type: 'root' | 'branch' | 'leaf' | 'junction'
  content: string
  connections: string[]
  size: number
  color: string
  energy: number
}

const architectureModes = [
  {
    id: 'branching',
    name: 'Branching Mode',
    icon: '🌿',
    description: 'Parallel exploration of multiple solution paths',
    color: '#4ecdc4'
  },
  {
    id: 'interactive',
    name: 'Interactive Mode', 
    icon: '🔄',
    description: 'Step-by-step validation with checkpoints',
    color: '#ff6b35'
  },
  {
    id: 'hybrid',
    name: 'Hybrid Mode',
    icon: '⚡',
    description: 'Combined branching and interaction patterns',
    color: '#9b59b6'
  }
]

export const Level3Architecture: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'branching' | 'interactive' | 'hybrid'>('branching')
  const [query, setQuery] = useState('')
  const [currentSeed, setCurrentSeed] = useState<ArchitectureSeed | null>(null)
  const [isGrowing, setIsGrowing] = useState(false)
  const [growthPhase, setGrowthPhase] = useState<'seeding' | 'sprouting' | 'branching' | 'flourishing'>('seeding')
  const [architectureGarden, setArchitectureGarden] = useState<ArchitectureSeed[]>([])

  const { generateParticles } = useEnergyStore()
  const { unlockAchievement } = useAchievements()

  const plantSeed = async () => {
    if (!query.trim()) return

    setIsGrowing(true)
    setGrowthPhase('seeding')
    unlockAchievement('first_architecture')

    // Generate energy particles for seed planting
    generateParticles(150, 'architecture')

    // Create initial seed
    const seed: ArchitectureSeed = {
      id: Math.random().toString(36).substr(2, 9),
      query,
      mode: selectedMode,
      growth: 0,
      structure: [],
      energy: 100,
      complexity: 1
    }

    setCurrentSeed(seed)

    // Simulate growth phases
    await growStructure(seed)
  }

  const growStructure = async (seed: ArchitectureSeed) => {
    const phases = ['sprouting', 'branching', 'flourishing'] as const
    
    for (let i = 0; i < phases.length; i++) {
      setGrowthPhase(phases[i])
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update structure based on mode and phase
      const newStructure = generateStructureForPhase(seed, phases[i])
      
      setCurrentSeed(prev => prev ? {
        ...prev,
        growth: (i + 1) / phases.length,
        structure: newStructure,
        complexity: i + 2
      } : null)
    }

    // Add to garden
    setArchitectureGarden(prev => [...prev, { ...seed, growth: 1 }])
    setIsGrowing(false)
    
    unlockAchievement('structure_grown')
  }

  const generateStructureForPhase = (seed: ArchitectureSeed, phase: string): StructureNode[] => {
    const nodes: StructureNode[] = []
    
    // Root node
    nodes.push({
      id: 'root',
      position: new THREE.Vector3(0, 0, 0),
      type: 'root',
      content: seed.query,
      connections: [],
      size: 0.3,
      color: '#4ecdc4',
      energy: 100
    })

    if (phase === 'sprouting') {
      // Add initial branches based on mode
      const branchCount = seed.mode === 'branching' ? 3 : seed.mode === 'interactive' ? 2 : 4
      
      for (let i = 0; i < branchCount; i++) {
        const angle = (i / branchCount) * Math.PI * 2
        const position = new THREE.Vector3(
          Math.cos(angle) * 1.5,
          Math.sin(angle) * 1.5,
          0
        )
        
        nodes.push({
          id: `branch-${i}`,
          position,
          type: 'branch',
          content: getBranchContent(seed.mode, i),
          connections: ['root'],
          size: 0.2,
          color: architectureModes.find(m => m.id === seed.mode)?.color || '#4ecdc4',
          energy: 80
        })
      }
    }

    if (phase === 'branching') {
      // Add secondary branches and connections
      const existingBranches = nodes.filter(n => n.type === 'branch')
      
      existingBranches.forEach((branch, index) => {
        // Add sub-branches
        for (let i = 0; i < 2; i++) {
          const offset = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 1
          )
          
          nodes.push({
            id: `sub-${index}-${i}`,
            position: branch.position.clone().add(offset),
            type: 'leaf',
            content: getLeafContent(seed.mode, index, i),
            connections: [branch.id],
            size: 0.15,
            color: branch.color,
            energy: 60
          })
        }
      })
    }

    if (phase === 'flourishing') {
      // Add junctions and complex connections
      const branches = nodes.filter(n => n.type === 'branch')
      
      if (branches.length > 2) {
        const centerPos = new THREE.Vector3(0, 0, 1)
        
        nodes.push({
          id: 'junction-center',
          position: centerPos,
          type: 'junction',
          content: 'Synthesis Hub',
          connections: branches.map(b => b.id),
          size: 0.25,
          color: '#9b59b6',
          energy: 120
        })
      }
    }

    return nodes
  }

  const getBranchContent = (mode: string, index: number): string => {
    const contents = {
      branching: ['Explore Path A', 'Explore Path B', 'Explore Path C'],
      interactive: ['Define Problem', 'Gather Requirements'],
      hybrid: ['Quick Analysis', 'Deep Dive', 'Creative Angle', 'Systematic Approach']
    }
    
    return contents[mode as keyof typeof contents]?.[index] || `Branch ${index + 1}`
  }

  const getLeafContent = (mode: string, branchIndex: number, leafIndex: number): string => {
    return `${mode} solution ${branchIndex + 1}.${leafIndex + 1}`
  }

  return (
    <div className="level3-architecture min-h-screen bg-space-black text-energy-white">
      {/* Header */}
      <div className="p-6 border-b border-energy-blue/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-energy-blue">
              Level 3: Architecture Gardens
            </h1>
            <p className="text-energy-dim mt-2">
              Seed-to-structure growth with intelligent branching patterns
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-energy-dim">
              Growth: <span className="text-energy-blue">{Math.round((currentSeed?.growth || 0) * 100)}%</span>
            </div>
            <div className="text-sm text-energy-dim">
              Phase: <span className="text-energy-blue capitalize">{growthPhase}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex h-screen-minus-header">
        {/* Garden Visualization */}
        <div className="flex-1 relative">
          <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <spotLight position={[0, 10, 0]} angle={0.3} intensity={0.5} />
            
            <OrbitControls enableZoom={true} enablePan={true} />
            
            {/* Architecture Structure */}
            {currentSeed && (
              <ArchitectureStructure 
                structure={currentSeed.structure}
                growth={currentSeed.growth}
                mode={currentSeed.mode}
              />
            )}
            
            {/* Garden Grid */}
            <GardenGrid />
            
            {/* Growth Effects */}
            {isGrowing && (
              <GrowthParticleSystem phase={growthPhase} />
            )}
          </Canvas>
          
          {/* Growth Phase Indicator */}
          <div className="absolute top-4 left-4 bg-deep-space rounded-lg p-4 border border-energy-blue/30">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-energy-blue rounded-full animate-pulse"></div>
              <span className="text-sm">
                {growthPhase === 'seeding' && '🌱 Planting seed...'}
                {growthPhase === 'sprouting' && '🌿 First growth emerging...'}
                {growthPhase === 'branching' && '🌳 Branches extending...'}
                {growthPhase === 'flourishing' && '🌺 Structure maturing...'}
              </span>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="w-96 p-6 border-l border-energy-blue/20 bg-deep-space/50">
          <div className="space-y-6">
            {/* Architecture Mode Selection */}
            <div>
              <h3 className="text-lg font-bold text-energy-blue mb-3">Architecture Mode</h3>
              <div className="space-y-2">
                {architectureModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id as any)}
                    className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                      selectedMode === mode.id 
                        ? 'border-energy-blue bg-energy-blue/10' 
                        : 'border-energy-blue/30 hover:border-energy-blue/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{mode.icon}</span>
                      <div>
                        <div className="font-medium">{mode.name}</div>
                        <div className="text-sm text-energy-dim">{mode.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Seed Input */}
            <div>
              <label className="block text-sm font-medium text-energy-blue mb-2">
                Architecture Seed
              </label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Describe what you want to build or explore..."
                className="w-full p-3 bg-deep-space border border-energy-blue/30 rounded-lg text-energy-white placeholder-energy-dim resize-none focus:outline-none focus:border-energy-blue"
                rows={3}
              />
            </div>

            {/* Plant Seed Action */}
            <button
              onClick={plantSeed}
              disabled={!query.trim() || isGrowing}
              className="w-full energy-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGrowing ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Growing Structure...
                </span>
              ) : (
                '🌱 Plant Architecture Seed'
              )}
            </button>

            {/* Current Structure Info */}
            {currentSeed && (
              <div className="bg-energy-blue/10 rounded-lg p-4 border border-energy-blue/30">
                <h3 className="text-lg font-bold text-energy-blue mb-2">Current Structure</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="text-energy-blue capitalize">{currentSeed.mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nodes:</span>
                    <span className="text-energy-blue">{currentSeed.structure.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Complexity:</span>
                    <span className="text-energy-blue">{currentSeed.complexity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy:</span>
                    <span className="text-energy-blue">{currentSeed.energy}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Garden History */}
            {architectureGarden.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-energy-blue">Architecture Garden</h3>
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {architectureGarden.map((seed) => (
                    <div key={seed.id} className="bg-deep-space rounded p-2 border border-energy-blue/20">
                      <div className="text-sm font-medium truncate">{seed.query}</div>
                      <div className="text-xs text-energy-dim capitalize">{seed.mode} • {seed.structure.length} nodes</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Level Navigation */}
      <LevelNavigation currentLevel={3} unlockedLevels={[1, 2, 3]} />
    </div>
  )
}

// Architecture Structure Visualization Component
const ArchitectureStructure: React.FC<{
  structure: StructureNode[]
  growth: number
  mode: string
}> = ({ structure, growth, mode }) => {
  return (
    <group>
      {structure.map((node, index) => (
        <group
          key={node.id}
        >
          <Sphere position={node.position} args={[node.size, 16, 16]}>
            <meshStandardMaterial 
              color={node.color}
              transparent
              opacity={0.8}
              emissive={node.color}
              emissiveIntensity={0.2}
            />
          </Sphere>
          
          <Text
            position={[node.position.x, node.position.y - 0.5, node.position.z]}
            fontSize={0.1}
            color={node.color}
            anchorX="center"
            anchorY="middle"
          >
            {node.content}
          </Text>
                 </group>
      ))}
      
      {/* Connections */}
      {structure.map((node) =>
        node.connections.map((connectionId) => {
          const targetNode = structure.find(n => n.id === connectionId)
          if (!targetNode) return null
          
          return (
            <Line
              key={`${node.id}-${connectionId}`}
              points={[node.position, targetNode.position]}
              color="#4ecdc4"
              lineWidth={2}
              transparent
              opacity={0.6}
            />
          )
        })
      )}
    </group>
  )
}

// Garden Grid Component
const GardenGrid: React.FC = () => {
  const lines: JSX.Element[] = []
  
  for (let i = -5; i <= 5; i++) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[[-5, i, -0.1], [5, i, -0.1]]}
        color="#4ecdc4"
        opacity={0.1}
        lineWidth={1}
      />
    )
    lines.push(
      <Line
        key={`v-${i}`}
        points={[[i, -5, -0.1], [i, 5, -0.1]]}
        color="#4ecdc4"
        opacity={0.1}
        lineWidth={1}
      />
    )
  }
  
  return <group>{lines}</group>
}

// Growth Particle System Component
const GrowthParticleSystem: React.FC<{ phase: string }> = ({ phase }) => {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01
    }
  })
  
  return (
    <group ref={groupRef}>
      {[...Array(20)].map((_, i) => (
        <Sphere key={i} position={[
          Math.sin(i) * 3,
          Math.cos(i) * 3,
          Math.sin(i * 0.5) * 2
        ]} args={[0.05, 8, 8]}>
          <meshStandardMaterial 
            color="#4ecdc4"
            transparent
            opacity={0.6}
            emissive="#4ecdc4"
            emissiveIntensity={0.3}
          />
        </Sphere>
      ))}
    </group>
  )
}