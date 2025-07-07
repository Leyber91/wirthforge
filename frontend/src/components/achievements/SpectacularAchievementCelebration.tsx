import { useEffect, useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useSpring, animated } from '@react-spring/three'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { Sphere, Box, Text } from '@react-three/drei'

interface Achievement {
  id: string
  name: string
  description: string
  energyCelebration: boolean
  particleBurst?: string
  unlockedAt?: Date
}

interface SpectacularAchievementCelebrationProps {
  achievement: Achievement | null
  onComplete: () => void
}

export const SpectacularAchievementCelebration: React.FC<SpectacularAchievementCelebrationProps> = ({
  achievement,
  onComplete
}) => {
  const [stage, setStage] = useState<'appearing' | 'celebrating' | 'disappearing'>('appearing')
  const [particleCount, setParticleCount] = useState(0)

  useEffect(() => {
    if (!achievement) return

    const sequence = async () => {
      // Stage 1: Dramatic appearance
      setStage('appearing')
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Stage 2: Particle explosion and celebration
      setStage('celebrating')
      setParticleCount(100)
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Stage 3: Graceful disappearance
      setStage('disappearing')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onComplete()
    }

    sequence()
  }, [achievement, onComplete])

  if (!achievement) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      >
        {/* 3D Celebration Scene */}
        <div className="w-full h-full relative">
          <Canvas
            camera={{ position: [0, 0, 10], fov: 60 }}
            style={{ background: 'transparent' }}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.2} color="#00ffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#9b59b6" />
            
            <CelebrationCore 
              achievement={achievement} 
              stage={stage}
              particleCount={particleCount}
            />
            <ParticleExplosion 
              active={stage === 'celebrating'} 
              count={particleCount}
              type={achievement.particleBurst || 'default'}
            />
            <EnergyFieldTransformation 
              achievement={achievement}
              stage={stage}
            />
          </Canvas>
        </div>

        {/* Achievement Text Overlay */}
        <motion.div
          initial={{ scale: 0, rotateY: -180 }}
          animate={{ scale: 1, rotateY: 0 }}
          exit={{ scale: 0, rotateY: 180 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20,
            duration: 0.8 
          }}
          className="absolute z-10 text-center px-8"
        >
          <motion.div
            animate={{ 
              scale: stage === 'celebrating' ? [1, 1.1, 1] : 1,
              rotateZ: stage === 'celebrating' ? [0, 5, -5, 0] : 0
            }}
            transition={{ 
              duration: 2, 
              repeat: stage === 'celebrating' ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="bg-gradient-to-br from-consciousness-purple via-adaptive-cyan to-sage-emerald p-8 rounded-2xl shadow-2xl border-2 border-energy-white"
          >
            <motion.h1
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold text-energy-white mb-4"
            >
              🎉 ACHIEVEMENT UNLOCKED! 🎉
            </motion.h1>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
              className="achievement-icon text-8xl mb-6"
            >
              {getAchievementIcon(achievement.id)}
            </motion.div>
            
            <motion.h2
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-4xl font-bold text-lightning-blue mb-3"
            >
              {achievement.name}
            </motion.h2>
            
            <motion.p
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-xl text-energy-gray max-w-md mx-auto"
            >
              {achievement.description}
            </motion.p>
            
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-6 text-sm text-energy-gray"
            >
              Unlocked {new Date().toLocaleDateString()}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Energy Rings */}
        <EnergyRings stage={stage} achievement={achievement} />
      </motion.div>
    </AnimatePresence>
  )
}

// 3D Celebration Core
const CelebrationCore: React.FC<{
  achievement: Achievement
  stage: string
  particleCount: number
}> = ({ achievement, stage, particleCount }) => {
  const coreRef = useRef<THREE.Mesh>(null)
  
  const [springs, api] = useSpring(() => ({
    scale: 0,
    rotation: 0,
    color: '#00ffff',
    config: { mass: 1, tension: 200, friction: 50 }
  }))

  useEffect(() => {
    if (stage === 'appearing') {
      api.start({ scale: 1, rotation: Math.PI * 2 })
    } else if (stage === 'celebrating') {
      api.start({ 
        scale: 1.2, 
        rotation: Math.PI * 4,
        color: getAchievementColor(achievement.id)
      })
    } else if (stage === 'disappearing') {
      api.start({ scale: 0, rotation: Math.PI * 6 })
    }
  }, [stage, achievement.id, api])

  useFrame((state) => {
    if (coreRef.current) {
      const time = state.clock.elapsedTime
      if (stage === 'celebrating') {
        coreRef.current.position.y = Math.sin(time * 3) * 0.2
        coreRef.current.rotation.z = time * 0.5
      }
    }
  })

  return (
    <animated.mesh 
      ref={coreRef}
      scale={springs.scale} 
      rotation-y={springs.rotation}
    >
      <Sphere args={[1.5, 32, 32]}>
        <animated.meshStandardMaterial 
          color={springs.color}
          transparent
          opacity={0.8}
          emissive={springs.color}
          emissiveIntensity={0.3}
        />
      </Sphere>
    </animated.mesh>
  )
}

// Particle Explosion System
const ParticleExplosion: React.FC<{
  active: boolean
  count: number
  type: string
}> = ({ active, count, type }) => {
  const particlesRef = useRef<THREE.Group>(null)
  const particleData = useRef<Array<{
    velocity: THREE.Vector3
    position: THREE.Vector3
    life: number
    maxLife: number
    color: THREE.Color
  }>>([])

  useEffect(() => {
    if (active && count > 0) {
      // Initialize particles
      particleData.current = Array.from({ length: count }, () => ({
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ),
        position: new THREE.Vector3(0, 0, 0),
        life: 3.0,
        maxLife: 3.0,
        color: new THREE.Color(getParticleColor(type))
      }))
    }
  }, [active, count, type])

  useFrame((state, delta) => {
    if (!active || !particlesRef.current) return

    particleData.current.forEach((particle, index) => {
      particle.life -= delta
      particle.position.add(particle.velocity.clone().multiplyScalar(delta))
      particle.velocity.multiplyScalar(0.98) // Damping
      
      const child = particlesRef.current?.children[index] as THREE.Mesh
      if (child) {
        child.position.copy(particle.position)
        const lifetimeRatio = particle.life / particle.maxLife
        child.scale.setScalar(lifetimeRatio)
        
        const material = child.material as THREE.MeshStandardMaterial
        material.opacity = lifetimeRatio
      }
    })
  })

  if (!active) return null

  return (
    <group ref={particlesRef}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i}>
          <Sphere args={[0.05, 8, 8]}>
            <meshStandardMaterial 
              color={getParticleColor(type)}
              transparent
              emissive={getParticleColor(type)}
              emissiveIntensity={0.5}
            />
          </Sphere>
        </mesh>
      ))}
    </group>
  )
}

// Energy Field Transformation
const EnergyFieldTransformation: React.FC<{
  achievement: Achievement
  stage: string
}> = ({ achievement, stage }) => {
  const fieldRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (fieldRef.current) {
      const time = state.clock.elapsedTime
      
      if (stage === 'celebrating') {
        fieldRef.current.rotation.y = time * 0.5
        fieldRef.current.rotation.z = time * 0.3
        
        const scale = 1 + Math.sin(time * 4) * 0.2
        fieldRef.current.scale.setScalar(scale)
      }
    }
  })

  const fieldType = getFieldType(achievement.id)

  return (
    <mesh ref={fieldRef}>
      {fieldType === 'sphere' && (
        <sphereGeometry args={[3, 32, 32]} />
      )}
      {fieldType === 'cube' && (
        <boxGeometry args={[5, 5, 5]} />
      )}
      {fieldType === 'octahedron' && (
        <octahedronGeometry args={[3, 2]} />
      )}
      <meshStandardMaterial 
        color={getAchievementColor(achievement.id)}
        transparent
        opacity={0.1}
        wireframe
        emissive={getAchievementColor(achievement.id)}
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

// Energy Rings Component
const EnergyRings: React.FC<{
  stage: string
  achievement: Achievement
}> = ({ stage, achievement }) => {
  const [rings, setRings] = useState<Array<{ id: number; delay: number }>>([])

  useEffect(() => {
    if (stage === 'celebrating') {
      setRings([
        { id: 1, delay: 0 },
        { id: 2, delay: 0.5 },
        { id: 3, delay: 1.0 },
        { id: 4, delay: 1.5 }
      ])
    }
  }, [stage])

  return (
    <div className="absolute inset-0 pointer-events-none">
      {rings.map((ring) => (
        <motion.div
          key={ring.id}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 2, 4],
            opacity: [1, 0.5, 0]
          }}
          transition={{
            duration: 2,
            delay: ring.delay,
            ease: "easeOut"
          }}
          className="absolute inset-0 rounded-full border-4 border-lightning-blue"
          style={{
            borderColor: getAchievementColor(achievement.id)
          }}
        />
      ))}
    </div>
  )
}

// Utility Functions
function getAchievementIcon(achievementId: string): string {
  const icons = {
    first_lightning: '⚡',
    council_master: '🌊',
    consciousness_pioneer: '🌌',
    architect_master: '🏗️',
    adaptive_master: '🧬',
    energy_explorer: '🔥',
    resonance_master: '💎'
  }
  return icons[achievementId as keyof typeof icons] || '🏆'
}

function getAchievementColor(achievementId: string): string {
  const colors = {
    first_lightning: '#00ffff',
    council_master: '#4ecdc4',
    consciousness_pioneer: '#9b59b6',
    architect_master: '#ff6b35',
    adaptive_master: '#45b7d1',
    energy_explorer: '#ff6b35',
    resonance_master: '#ffffff'
  }
  return colors[achievementId as keyof typeof colors] || '#00ffff'
}

function getParticleColor(type: string): string {
  const colors = {
    blue_lightning: '#00ffff',
    rainbow_convergence: '#ff6b35',
    transcendent_field: '#9b59b6',
    energy_burst: '#ff6b35',
    default: '#00ffff'
  }
  return colors[type as keyof typeof colors] || '#00ffff'
}

function getFieldType(achievementId: string): 'sphere' | 'cube' | 'octahedron' {
  const types: Record<string, 'sphere' | 'cube' | 'octahedron'> = {
    first_lightning: 'sphere',
    council_master: 'octahedron',
    consciousness_pioneer: 'octahedron',
    architect_master: 'cube',
    adaptive_master: 'sphere'
  }
  return types[achievementId] || 'sphere'
}

export default SpectacularAchievementCelebration