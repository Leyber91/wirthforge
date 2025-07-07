import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points } from '@react-three/drei'
import * as THREE from 'three'

interface AdvancedEnergySystemProps {
  energyFlow: any
  quality?: 'low' | 'medium' | 'high' | 'ultra'
  enableShaders?: boolean
  enableLighting?: boolean
  enableEffects?: boolean
  width?: number
  height?: number
}

export const AdvancedEnergySystem: React.FC<AdvancedEnergySystemProps> = ({
  energyFlow,
  quality = 'medium',
  enableShaders = true,
  enableLighting = true,
  enableEffects = true,
  width = 800,
  height = 400
}) => {
  const particleSystemRef = useRef<THREE.Points>(null)
  
  // Generate particles with optimized count based on quality
  const { positions, sizes, customColors } = useMemo(() => {
    const qualityMultiplier = {
      low: 0.5,
      medium: 1.0,
      high: 1.5,
      ultra: 2.0
    }[quality]
    
    const baseCount = energyFlow?.particles?.length || 50
    const count = Math.floor(baseCount * qualityMultiplier)
    
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const customColors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const particle = energyFlow?.particles?.[i % energyFlow.particles.length]
      if (particle) {
        positions[i * 3] = particle.position.x
        positions[i * 3 + 1] = particle.position.y
        positions[i * 3 + 2] = particle.position.z
        
        sizes[i] = particle.size * (0.5 + Math.random() * 0.5)
        
        customColors[i * 3] = particle.color.r
        customColors[i * 3 + 1] = particle.color.g
        customColors[i * 3 + 2] = particle.color.b
      } else {
        // Default particle
        positions[i * 3] = (Math.random() - 0.5) * 10
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5
        
        sizes[i] = 0.1
        
        customColors[i * 3] = 0
        customColors[i * 3 + 1] = 1
        customColors[i * 3 + 2] = 1
      }
    }
    
    return { positions, sizes, customColors }
  }, [energyFlow?.particles, quality])
  
  // Animation loop
  useFrame((state) => {
    if (particleSystemRef.current) {
      particleSystemRef.current.rotation.y += 0.01
    }
  })
  
  return (
    <div className="advanced-energy-system" style={{ width, height }}>
      <group>
        {/* Particle System */}
        <Points ref={particleSystemRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-size"
              count={sizes.length}
              array={sizes}
              itemSize={1}
            />
            <bufferAttribute
              attach="attributes-color"
              count={customColors.length / 3}
              array={customColors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            transparent
            color={energyFlow?.flow?.color || '#00ffff'}
            size={0.1}
            vertexColors
          />
        </Points>

        {/* Energy Flow Lines */}
        {energyFlow?.flow?.path?.length > 1 && (
          <mesh>
            <tubeGeometry
              args={[
                new THREE.CatmullRomCurve3(energyFlow.flow.path),
                64,
                0.02,
                8,
                false
              ]}
            />
            <meshBasicMaterial
              color={energyFlow.flow.color}
              transparent
              opacity={0.6}
            />
          </mesh>
        )}

        {/* Lightning Effects */}
        {energyFlow?.type === 'lightning' && (
          <mesh>
            <planeGeometry args={[0.1, 2]} />
            <meshBasicMaterial
              color={energyFlow?.flow?.color || '#00ffff'}
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {/* Environment Effects */}
        {enableEffects && (
          <EnvironmentEffects type={energyFlow?.type || 'lightning'} />
        )}
      </group>
    </div>
  )
}

const EnvironmentEffects: React.FC<{ type: string }> = ({ type }) => {
  return (
    <group>
      {/* Ambient lighting based on energy type */}
      <ambientLight intensity={0.2} color={type === 'lightning' ? '#0066ff' : '#ffffff'} />
      
      {/* Point lights for energy glow */}
      <pointLight
        position={[0, 0, 0]}
        intensity={0.5}
        color={type === 'lightning' ? '#00ffff' : '#ffffff'}
        distance={10}
      />
    </group>
  )
}