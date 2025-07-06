import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { EnergyFlow, Particle } from '../../types/energy'

interface EnergyVisualizationProps {
  energyFlow: EnergyFlow
  width?: number
  height?: number
}

export const EnergyVisualization: React.FC<EnergyVisualizationProps> = ({ 
  energyFlow, 
  width = 800, 
  height = 400 
}) => {
  return (
    <div className="energy-visualization relative overflow-hidden" style={{ width, height }}>
      {/* Background energy field */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-blue-900/20 animate-pulse" />
      
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        {/* Enhanced lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#4ecdc4" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ff6b35" />
        <spotLight position={[0, 10, 0]} angle={0.3} intensity={1.5} color="#9b59b6" />
        
        {/* Enhanced particle system */}
        <ParticleSystem particles={energyFlow.particles} />
        <EnergyFlowRenderer flow={energyFlow.flow} />
        <LightningEffects />
        
        {energyFlow.resonance && (
          <ResonanceFieldRenderer field={energyFlow.resonance} />
        )}
        
        {/* Energy signature visualization */}
        <EnergySignatureRenderer />
      </Canvas>
      
      {/* Energy metrics overlay */}
      <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg p-3 text-xs">
        <div className="text-cyan-400">Energy Flow: {energyFlow.flow?.speed?.toFixed(1) || 0}</div>
        <div className="text-purple-400">Particles: {energyFlow.particles.length}</div>
        <div className="text-orange-400">Resonance: {energyFlow.resonance?.frequency?.toFixed(2) || 0}</div>
      </div>
    </div>
  )
}

const ParticleSystem: React.FC<{ particles: Particle[] }> = ({ particles }) => {
  const pointsRef = useRef<THREE.Points>(null)
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particles.length * 3)
    const colors = new Float32Array(particles.length * 3)
    const sizes = new Float32Array(particles.length)
    
    particles.forEach((particle, i) => {
      // Position
      positions[i * 3] = particle.position.x
      positions[i * 3 + 1] = particle.position.y
      positions[i * 3 + 2] = particle.position.z
      
      // Color
      colors[i * 3] = particle.color.r
      colors[i * 3 + 1] = particle.color.g
      colors[i * 3 + 2] = particle.color.b
      
      // Size based on energy and lifetime
      const lifetimeRatio = particle.lifetime / particle.maxLifetime
      sizes[i] = particle.size * particle.energy * lifetimeRatio
    })
    
    return { positions, colors, sizes }
  }, [particles])
  
  useFrame((state, delta) => {
    if (pointsRef.current) {
      // Update particle positions and properties
      particles.forEach((particle, i) => {
        // Update lifetime
        particle.lifetime -= delta
        
        // Update position based on velocity
        particle.position.add(
          particle.velocity.clone().multiplyScalar(delta)
        )
        
        // Update positions array
        positions[i * 3] = particle.position.x
        positions[i * 3 + 1] = particle.position.y
        positions[i * 3 + 2] = particle.position.z
        
        // Update size based on remaining lifetime
        const lifetimeRatio = Math.max(0, particle.lifetime / particle.maxLifetime)
        sizes[i] = particle.size * particle.energy * lifetimeRatio
      })
      
      // Mark attributes as needing update
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      pointsRef.current.geometry.attributes.size.needsUpdate = true
    }
  })
  
  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particles.length} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-color" 
          count={particles.length} 
          array={colors} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-size" 
          count={particles.length} 
          array={sizes} 
          itemSize={1} 
        />
      </bufferGeometry>
      <PointMaterial 
        size={0.1} 
        vertexColors 
        transparent 
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

const EnergyFlowRenderer: React.FC<{ flow: any }> = ({ flow }) => {
  const lineRef = useRef<THREE.Line>(null)
  
  useFrame((state) => {
    if (lineRef.current && flow.path) {
      // Animate the energy flow along the path
      const time = state.clock.elapsedTime
      const material = lineRef.current.material as THREE.LineBasicMaterial
      
      // Pulse effect
      material.opacity = 0.5 + 0.3 * Math.sin(time * flow.speed * 2)
    }
  })
  
  if (!flow.path || flow.path.length === 0) return null
  
  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={flow.path.length} 
          array={new Float32Array(flow.path.flatMap(p => [p.x, p.y, p.z]))} 
          itemSize={3} 
        />
      </bufferGeometry>
      <lineBasicMaterial 
        color={flow.color} 
        transparent 
        opacity={0.8}
        linewidth={2}
      />
    </line>
  )
}

const ResonanceFieldRenderer: React.FC<{ field: any }> = ({ field }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      
      // Rotate the field
      meshRef.current.rotation.y = time * 0.1
      meshRef.current.rotation.z = time * 0.05
      
      // Pulse the scale
      const scale = 1 + 0.1 * Math.sin(time * field.frequency)
      meshRef.current.scale.setScalar(scale)
    }
  })
  
  return (
    <mesh ref={meshRef} position={[field.center.x, field.center.y, field.center.z]}>
      <sphereGeometry args={[field.radius, 32, 32]} />
      <meshStandardMaterial 
        color="#9b59b6" 
        transparent 
        opacity={0.2}
        wireframe
      />
    </mesh>
  )
}

// Lightning Effects Component
const LightningEffects: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null)
  const [lightning, setLightning] = useState<THREE.Vector3[]>([])
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.01
      
      // Generate lightning bolts occasionally
      if (Math.random() < 0.02) {
        const newLightning = []
        const startPoint = new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          0
        )
        const endPoint = new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          0
        )
        
        // Generate zigzag lightning path
        const steps = 8
        for (let i = 0; i <= steps; i++) {
          const t = i / steps
          const point = startPoint.clone().lerp(endPoint, t)
          point.x += (Math.random() - 0.5) * 0.5
          point.y += (Math.random() - 0.5) * 0.5
          newLightning.push(point)
        }
        
        setLightning(newLightning)
        
        // Clear lightning after a short time
        setTimeout(() => setLightning([]), 150)
      }
    }
  })
  
  return (
    <group ref={groupRef}>
      {lightning.length > 0 && (
        <line>
          <bufferGeometry>
            <bufferAttribute 
              attach="attributes-position" 
              count={lightning.length} 
              array={new Float32Array(lightning.flatMap((p: THREE.Vector3) => [p.x, p.y, p.z]))} 
              itemSize={3} 
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color="#4ecdc4" 
            transparent 
            opacity={0.9}
            linewidth={3}
          />
        </line>
      )}
    </group>
  )
}

// Energy Signature Renderer Component
const EnergySignatureRenderer: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null)
  const [signature, setSignature] = useState({
    density: 0,
    flow: 0,
    resonance: 0
  })
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime
      
      // Animate based on energy signature
      meshRef.current.rotation.y = time * 0.2
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
      
      // Update signature values
      setSignature({
        density: 0.5 + 0.3 * Math.sin(time * 0.7),
        flow: 0.5 + 0.4 * Math.sin(time * 0.5),
        resonance: 0.5 + 0.2 * Math.sin(time * 0.9)
      })
    }
  })
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <torusGeometry args={[2, 0.1, 16, 100]} />
      <meshStandardMaterial 
        color="#ff6b35" 
        transparent 
        opacity={0.6}
        emissive="#ff6b35"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
} 