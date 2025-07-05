import { create } from 'zustand'
import * as THREE from 'three'
import { EnergyFlow, Particle, EnergyType, LightningStrike } from '../types/energy'

interface EnergyState {
  energyFlow: EnergyFlow
  isGenerating: boolean
  lightningStrikes: LightningStrike[]
  
  // Actions
  triggerLightningStrike: (query: string) => void
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