import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import { EnergyFlow } from '../../types/energy'

interface EnergyVisualizationProps {
  energyFlow: EnergyFlow
  width: number
  height: number
}

export const EnergyVisualization: React.FC<EnergyVisualizationProps> = ({
  energyFlow,
  width,
  height
}) => {
  const particlesRef = useRef<THREE.Points>(null)
  const groupRef = useRef<THREE.Group>(null)

  // Generate particle positions and colors
  const { positions, colors } = useMemo(() => {
    const count = energyFlow.particles.length
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    energyFlow.particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x
      positions[i * 3 + 1] = particle.position.y
      positions[i * 3 + 2] = particle.position.z

      colors[i * 3] = particle.color.r
      colors[i * 3 + 1] = particle.color.g
      colors[i * 3 + 2] = particle.color.b
    })

    return { positions, colors }
  }, [energyFlow.particles])

  // Generate flow path
  const flowPath = useMemo(() => {
    if (energyFlow.flow.path.length < 2) return null
    
    return energyFlow.flow.path.map(point => 
      new THREE.Vector3(point.x, point.y, point.z)
    )
  }, [energyFlow.flow.path])

  // Animation
  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.5
      
      // Update particle positions with energy flow
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
      
      energyFlow.particles.forEach((particle, i) => {
        // Update positions based on particle velocity
        particle.position.add(
          particle.velocity.clone().multiplyScalar(delta)
        )
        
        // Update buffer
        positions[i * 3] = particle.position.x
        positions[i * 3 + 1] = particle.position.y
        positions[i * 3 + 2] = particle.position.z
      })
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (groupRef.current) {
      groupRef.current.rotation.z += delta * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {/* Particle System */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      {/* Energy Flow Path */}
      {flowPath && (
        <Line
          points={flowPath}
          color={energyFlow.flow.color}
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      )}

      {/* Energy Core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color={energyFlow.flow.color}
          transparent
          opacity={energyFlow.intensity}
        />
      </mesh>
    </group>
  )
} 