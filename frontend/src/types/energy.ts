import * as THREE from 'three'

export interface Particle {
  id: string
  position: THREE.Vector3
  velocity: THREE.Vector3
  color: THREE.Color
  lifetime: number
  maxLifetime: number
  size: number
  energy: number
}

export interface EnergyFlow {
  particles: Particle[]
  flow: FlowPattern
  resonance?: ResonanceField
  intensity: number
  type: EnergyType
}

export interface FlowPattern {
  path: THREE.Vector3[]
  intensity: number
  direction: THREE.Vector3
  speed: number
  color: string
}

export interface ResonanceField {
  center: THREE.Vector3
  radius: number
  strength: number
  frequency: number
  patterns: EnergyPattern[]
}

export interface EnergyPattern {
  id: string
  type: 'lightning' | 'stream' | 'burst' | 'field'
  intensity: number
  duration: number
  color: string
  position: THREE.Vector3
}

export interface EnergySignature {
  timing_pattern: TimingPattern
  semantic_density: number
  confidence_flow: number
  energy_density: number
  resonance_potential: number
}

export interface TimingPattern {
  mean_interval: number
  std_interval: number
  rhythm_pattern: number[]
  burst_patterns: BurstPattern[]
}

export interface BurstPattern {
  position: number
  speed: number
  intensity: number
}

export type EnergyType = 'lightning' | 'council' | 'architecture' | 'adaptive' | 'consciousness'

export interface LightningStrike {
  start: THREE.Vector3
  end: THREE.Vector3
  color: string
  duration: number
  intensity: number
  branches: THREE.Vector3[][]
}

export interface CouncilStream {
  id: string
  model: string
  color: string
  path: THREE.Vector3[]
  intensity: number
  active: boolean
}

export interface HarmonyForum {
  center: THREE.Vector3
  radius: number
  streams: CouncilStream[]
  convergence: number
  synthesis_energy: number
} 