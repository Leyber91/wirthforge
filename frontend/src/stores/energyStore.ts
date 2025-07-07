import { create } from 'zustand'
import * as THREE from 'three'
import { EnergyFlow, Particle, EnergyType, LightningStrike } from '../types/energy'

interface EnergyState {
  energyFlow: EnergyFlow
  isGenerating: boolean
  lightningStrikes: LightningStrike[]
  
  // Actions
  triggerLightningStrike: (query: string) => void
  triggerAdaptiveField: (query: string) => void
  triggerConsciousnessField: (query: string) => void
  generateParticles: (count: number, type: EnergyType) => void
  updateEnergyFlow: (flow: EnergyFlow) => void
  clearEnergy: () => void
}

const createDefaultEnergyFlow = (): EnergyFlow => ({
  particles: [],
  flow: {
    path: [],
    intensity: 0,
    direction: new THREE.Vector3(0, 1, 0),
    speed: 1,
    color: '#00ffff'
  },
  intensity: 0,
  type: 'lightning'
})

const createParticle = (
  position: THREE.Vector3,
  velocity: THREE.Vector3,
  color: THREE.Color,
  energy: number = 1
): Particle => ({
  id: Math.random().toString(36).substr(2, 9),
  position: position.clone(),
  velocity: velocity.clone(),
  color: color.clone(),
  lifetime: 3.0,
  maxLifetime: 3.0,
  size: 0.1,
  energy
})

export const useEnergyStore = create<EnergyState>((set, get) => ({
  energyFlow: createDefaultEnergyFlow(),
  isGenerating: false,
  lightningStrikes: [],

  triggerLightningStrike: (query: string) => {
    set({ isGenerating: true })
    
    // Create lightning strike from input to center
    const start = new THREE.Vector3(-3, -2, 0)
    const end = new THREE.Vector3(0, 0, 0)
    
    const lightningStrike: LightningStrike = {
      start,
      end,
      color: '#00ffff',
      duration: 0.5,
      intensity: 1.0,
      branches: createLightningBranches(start, end)
    }
    
    // Generate particles along the lightning path
    const particles: Particle[] = []
    const particleCount = Math.min(query.length * 2, 100)
    
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount
      const position = start.clone().lerp(end, t)
      
      // Add some randomness
      position.add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5,
        (Math.random() - 0.5) * 0.5
      ))
      
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2
      )
      
      const color = new THREE.Color('#00ffff')
      particles.push(createParticle(position, velocity, color))
    }
    
    // Update energy flow
    const newEnergyFlow: EnergyFlow = {
      particles,
      flow: {
        path: [start, end],
        intensity: 1.0,
        direction: end.clone().sub(start).normalize(),
        speed: 2.0,
        color: '#00ffff'
      },
      intensity: 1.0,
      type: 'lightning'
    }
    
    set(state => ({
      energyFlow: newEnergyFlow,
      lightningStrikes: [...state.lightningStrikes, lightningStrike]
    }))
    
    // Clear generating state after animation
    setTimeout(() => {
      set({ isGenerating: false })
    }, 1000)
  },

  triggerAdaptiveField: (query: string) => {
    set({ isGenerating: true })
    
    // Create adaptive field particles - more complex pattern
    const particles: Particle[] = []
    const particleCount = Math.min(query.length * 3, 150)
    const center = new THREE.Vector3(0, 0, 0)
    
    for (let i = 0; i < particleCount; i++) {
      // Create spiral pattern for adaptive field
      const t = i / particleCount
      const angle = t * Math.PI * 8
      const radius = 2 + Math.sin(t * Math.PI * 4) * 1.5
      
      const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (t - 0.5) * 4
      )
      
      const velocity = new THREE.Vector3(
        Math.cos(angle + Math.PI/2) * 0.5,
        Math.sin(angle + Math.PI/2) * 0.5,
        Math.sin(t * Math.PI * 2) * 0.3
      )
      
      const color = new THREE.Color('#45b7d1') // Adaptive cyan
      particles.push(createParticle(position, velocity, color, 1.2))
    }
    
    // Update energy flow for adaptive pattern
    const newEnergyFlow: EnergyFlow = {
      particles,
      flow: {
        path: [], // Adaptive fields don't have linear paths
        intensity: 1.2,
        direction: new THREE.Vector3(0, 1, 0),
        speed: 1.5,
        color: '#45b7d1'
      },
      intensity: 1.2,
      type: 'adaptive'
    }
    
    set({ energyFlow: newEnergyFlow })
    
    // Clear generating state after longer animation for adaptive field
    setTimeout(() => {
      set({ isGenerating: false })
         }, 2000)
   },

  triggerConsciousnessField: (query: string) => {
    set({ isGenerating: true })
    
    // Create consciousness field particles - complex resonance pattern
    const particles: Particle[] = []
    const particleCount = Math.min(query.length * 4, 200)
    const center = new THREE.Vector3(0, 0, 0)
    
    for (let i = 0; i < particleCount; i++) {
      // Create resonance field pattern
      const t = i / particleCount
      const layer = Math.floor(t * 5)
      const angle = t * Math.PI * 12 + layer * Math.PI / 3
      const radius = 1 + layer * 0.8 + Math.sin(t * Math.PI * 6) * 0.5
      const height = Math.sin(t * Math.PI * 4) * 2
      
      const position = new THREE.Vector3(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      )
      
      const velocity = new THREE.Vector3(
        Math.cos(angle + Math.PI/2) * 0.3,
        Math.sin(t * Math.PI * 3) * 0.2,
        Math.sin(angle + Math.PI/2) * 0.3
      )
      
      const color = new THREE.Color('#9b59b6') // Consciousness purple
      particles.push(createParticle(position, velocity, color, 1.5))
    }
    
    // Update energy flow for consciousness pattern
    const newEnergyFlow: EnergyFlow = {
      particles,
      flow: {
        path: [], // Consciousness fields are non-linear
        intensity: 1.5,
        direction: new THREE.Vector3(0, 1, 0),
        speed: 1.0,
        color: '#9b59b6'
      },
      intensity: 1.5,
      type: 'consciousness'
    }
    
    set({ energyFlow: newEnergyFlow })
    
    // Clear generating state after longer animation for consciousness field
    setTimeout(() => {
      set({ isGenerating: false })
    }, 3000)
  },

  generateParticles: (count: number, type: EnergyType) => {
    const particles: Particle[] = []
    
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5
      )
      
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 2,
        (Math.random() - 0.5) * 2
      )
      
      const color = getEnergyColor(type)
      particles.push(createParticle(position, velocity, color))
    }
    
    set(state => ({
      energyFlow: {
        ...state.energyFlow,
        particles: [...state.energyFlow.particles, ...particles]
      }
    }))
  },

  updateEnergyFlow: (flow: EnergyFlow) => {
    set({ energyFlow: flow })
  },

  clearEnergy: () => {
    set({ 
      energyFlow: createDefaultEnergyFlow(),
      lightningStrikes: []
    })
  }
}))

function createLightningBranches(start: THREE.Vector3, end: THREE.Vector3): THREE.Vector3[][] {
  const branches: THREE.Vector3[][] = []
  const mainPath: THREE.Vector3[] = []
  
  // Create main lightning path with some randomness
  const segments = 10
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const point = start.clone().lerp(end, t)
    
    // Add randomness to create lightning effect
    if (i > 0 && i < segments) {
      point.add(new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
      ))
    }
    
    mainPath.push(point)
  }
  
  branches.push(mainPath)
  
  // Create smaller branches
  for (let i = 0; i < 3; i++) {
    const branchStart = mainPath[Math.floor(Math.random() * mainPath.length)]
    const branchEnd = branchStart.clone().add(new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 1
    ))
    
    branches.push([branchStart, branchEnd])
  }
  
  return branches
}

function getEnergyColor(type: EnergyType): THREE.Color {
  switch (type) {
    case 'lightning':
      return new THREE.Color('#00ffff')
    case 'council':
      return new THREE.Color('#4ecdc4')
    case 'architecture':
      return new THREE.Color('#ff6b35')
    case 'adaptive':
      return new THREE.Color('#45b7d1')
    case 'consciousness':
      return new THREE.Color('#9b59b6')
    default:
      return new THREE.Color('#00ffff')
  }
} 