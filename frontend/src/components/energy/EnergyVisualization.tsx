import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useMemo, useRef } from 'react'
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
    <div className="energy-visualization" style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        <ParticleSystem particles={energyFlow.particles} />
        <EnergyFlowRenderer flow={energyFlow.flow} />
        
        {energyFlow.resonance && (
          <ResonanceFieldRenderer field={energyFlow.resonance} />
        )}
      </Canvas>
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