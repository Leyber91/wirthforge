import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial, Sphere, Line, shaderMaterial } from '@react-three/drei'
import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { extend } from '@react-three/fiber'
import { EnergyFlow, Particle, EnergyType } from '../../types/energy'

// Custom shaders for advanced energy effects
const EnergyShaderMaterial = shaderMaterial(
  {
    time: 0,
    color: new THREE.Color('#00ffff'),
    intensity: 1.0,
    flow: 0.0,
    resonance: 0.0
  },
  // Vertex shader
  `
    uniform float time;
    uniform float flow;
    attribute float size;
    attribute vec3 customColor;
    varying vec3 vColor;
    varying float vSize;
    
    void main() {
      vColor = customColor;
      vSize = size;
      
      vec3 pos = position;
      
      // Add energy flow animation
      pos.y += sin(time * 2.0 + position.x * 0.5) * flow * 0.3;
      pos.x += cos(time * 1.5 + position.z * 0.3) * flow * 0.2;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform float intensity;
    uniform float resonance;
    varying vec3 vColor;
    varying float vSize;
    
    void main() {
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      
      if (dist > 0.5) discard;
      
      // Create energy glow effect
      float alpha = 1.0 - dist * 2.0;
      alpha = pow(alpha, 2.0);
      
      // Add pulsing effect
      float pulse = sin(time * 4.0) * 0.3 + 0.7;
      alpha *= pulse * intensity;
      
      // Add resonance effect
      float resonanceGlow = sin(time * 8.0 + dist * 10.0) * resonance * 0.3 + 1.0;
      
      vec3 finalColor = vColor * resonanceGlow;
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
)

extend({ EnergyShaderMaterial })

// Lightning shader for spectacular lightning effects
const LightningShaderMaterial = shaderMaterial(
  {
    time: 0,
    progress: 0,
    color: new THREE.Color('#00ffff'),
    thickness: 0.02,
    intensity: 1.0
  },
  // Vertex shader
  `
    uniform float time;
    uniform float progress;
    varying vec2 vUv;
    varying float vProgress;
    
    void main() {
      vUv = uv;
      vProgress = progress;
      
      vec3 pos = position;
      
      // Add lightning branching effect
      float noise = sin(pos.x * 20.0 + time * 10.0) * 0.01;
      pos.x += noise * progress;
      pos.y += sin(pos.z * 15.0 + time * 8.0) * 0.015 * progress;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float intensity;
    varying vec2 vUv;
    varying float vProgress;
    
    void main() {
      float edge = abs(vUv.y - 0.5) * 2.0;
      float alpha = 1.0 - edge;
      alpha = pow(alpha, 3.0);
      
      // Add electric crackling effect
      float crackle = sin(vUv.x * 50.0 + time * 20.0) * 0.3 + 0.7;
      alpha *= crackle * intensity * vProgress;
      
      vec3 finalColor = color * (1.0 + sin(time * 15.0) * 0.5);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
)

extend({ LightningShaderMaterial })

interface AdvancedEnergySystemProps {
  energyFlow: EnergyFlow
  width?: number
  height?: number
  quality?: 'low' | 'medium' | 'high' | 'ultra'
}

export const AdvancedEnergySystem: React.FC<AdvancedEnergySystemProps> = ({ 
  energyFlow, 
  width = 800, 
  height = 400,
  quality = 'high'
}) => {
  return (
    <div className="advanced-energy-system" style={{ width, height }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: quality !== 'low',
          alpha: true,
          powerPreference: quality === 'ultra' ? 'high-performance' : 'default'
        }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.4} color="#9b59b6" />
        
        <AdvancedParticleSystem particles={energyFlow.particles} quality={quality} />
        <EnergyFlowRenderer flow={energyFlow.flow} type={energyFlow.type} />
        <LightningEffects energyFlow={energyFlow} />
        
        {energyFlow.resonance && (
          <ResonanceFieldRenderer field={energyFlow.resonance} />
        )}
        
        <EnvironmentEffects type={energyFlow.type} intensity={energyFlow.intensity} />
      </Canvas>
    </div>
  )
}

const AdvancedParticleSystem: React.FC<{ 
  particles: Particle[]; 
  quality: 'low' | 'medium' | 'high' | 'ultra' 
}> = ({ particles, quality }) => {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<any>(null)
  
  const particleCount = useMemo(() => {
    const qualityMultiplier = {
      low: 0.5,
      medium: 0.75,
      high: 1.0,
      ultra: 1.5
    }[quality]
    
    return Math.floor(particles.length * qualityMultiplier)
  }, [particles.length, quality])
  
  const { positions, colors, sizes, customColors } = useMemo(() => {
    const activeParticles = particles.slice(0, particleCount)
    const positions = new Float32Array(activeParticles.length * 3)
    const colors = new Float32Array(activeParticles.length * 3)
    const sizes = new Float32Array(activeParticles.length)
    const customColors = new Float32Array(activeParticles.length * 3)
    
    activeParticles.forEach((particle, i) => {
      // Position
      positions[i * 3] = particle.position.x
      positions[i * 3 + 1] = particle.position.y
      positions[i * 3 + 2] = particle.position.z
      
      // Color
      colors[i * 3] = particle.color.r
      colors[i * 3 + 1] = particle.color.g
      colors[i * 3 + 2] = particle.color.b
      
      // Custom color for shader
      customColors[i * 3] = particle.color.r
      customColors[i * 3 + 1] = particle.color.g
      customColors[i * 3 + 2] = particle.color.b
      
      // Size based on energy and lifetime
      const lifetimeRatio = particle.lifetime / particle.maxLifetime
      const energySize = particle.size * particle.energy * lifetimeRatio
      sizes[i] = Math.max(energySize * 20, 2) // Minimum size for visibility
    })
    
    return { positions, colors, sizes, customColors }
  }, [particles, particleCount])
  
  useFrame((state, delta) => {
    if (pointsRef.current && materialRef.current) {
      // Update shader uniforms
      materialRef.current.time = state.clock.elapsedTime
      materialRef.current.flow = Math.sin(state.clock.elapsedTime * 0.5) * 0.5 + 0.5
      materialRef.current.resonance = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7
      
      // Update particle positions
      particles.slice(0, particleCount).forEach((particle, i) => {
        // Update lifetime
        particle.lifetime -= delta
        
        // Update position based on velocity
        particle.position.add(
          particle.velocity.clone().multiplyScalar(delta)
        )
        
        // Add energy-based movement
        const energyForce = new THREE.Vector3(
          Math.sin(state.clock.elapsedTime + particle.position.y) * 0.01,
          Math.cos(state.clock.elapsedTime * 0.7 + particle.position.x) * 0.01,
          Math.sin(state.clock.elapsedTime * 0.3 + particle.position.z) * 0.005
        )
        particle.position.add(energyForce)
        
        // Update positions array
        positions[i * 3] = particle.position.x
        positions[i * 3 + 1] = particle.position.y
        positions[i * 3 + 2] = particle.position.z
        
        // Update size based on remaining lifetime
        const lifetimeRatio = Math.max(0, particle.lifetime / particle.maxLifetime)
        sizes[i] = Math.max(particle.size * particle.energy * lifetimeRatio * 20, 1)
      })
      
      // Mark attributes as needing update
      if (pointsRef.current.geometry.attributes.position) {
        pointsRef.current.geometry.attributes.position.needsUpdate = true
      }
      if (pointsRef.current.geometry.attributes.size) {
        pointsRef.current.geometry.attributes.size.needsUpdate = true
      }
    }
  })
  
  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute 
          attach="attributes-position" 
          count={particleCount} 
          array={positions} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-customColor" 
          count={particleCount} 
          array={customColors} 
          itemSize={3} 
        />
        <bufferAttribute 
          attach="attributes-size" 
          count={particleCount} 
          array={sizes} 
          itemSize={1} 
        />
      </bufferGeometry>
      <energyShaderMaterial 
        ref={materialRef}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        vertexColors
      />
    </Points>
  )
}

const EnergyFlowRenderer: React.FC<{ 
  flow: any; 
  type: EnergyType 
}> = ({ flow, type }) => {
  const lineRef = useRef<THREE.Line>(null)
  const tubeRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (tubeRef.current) {
      const time = state.clock.elapsedTime
      
      // Animate energy flow
      const material = tubeRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.6 + 0.4 * Math.sin(time * flow.speed * 3)
      
      // Rotate for consciousness and adaptive types
      if (type === 'consciousness' || type === 'adaptive') {
        tubeRef.current.rotation.z = time * 0.5
      }
    }
  })
  
  if (!flow.path || flow.path.length === 0) return null
  
  // Create tube geometry for better energy flow visualization
  const curve = new THREE.CatmullRomCurve3(flow.path)
  const tubeGeometry = new THREE.TubeGeometry(curve, 64, 0.05, 8, false)
  
  return (
    <mesh ref={tubeRef} geometry={tubeGeometry}>
      <meshBasicMaterial 
        color={flow.color} 
        transparent 
        opacity={0.8}
        emissive={flow.color}
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

const LightningEffects: React.FC<{ energyFlow: EnergyFlow }> = ({ energyFlow }) => {
  const lightningRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<any>(null)
  
  useFrame((state) => {
    if (materialRef.current && energyFlow.type === 'lightning') {
      materialRef.current.time = state.clock.elapsedTime
      materialRef.current.progress = Math.min(state.clock.elapsedTime / 2, 1)
      materialRef.current.intensity = energyFlow.intensity
    }
  })
  
  if (energyFlow.type !== 'lightning') return null
  
  return (
    <mesh ref={lightningRef}>
      <planeGeometry args={[6, 0.1]} />
      <lightningShaderMaterial 
        ref={materialRef}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

const ResonanceFieldRenderer: React.FC<{ field: any }> = ({ field }) => {
  const fieldRef = useRef<THREE.Mesh>(null)
  const innerRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (fieldRef.current && innerRef.current) {
      const time = state.clock.elapsedTime
      
      // Outer field rotation
      fieldRef.current.rotation.y = time * 0.1
      fieldRef.current.rotation.z = time * 0.05
      
      // Inner field counter-rotation
      innerRef.current.rotation.y = -time * 0.15
      innerRef.current.rotation.x = time * 0.08
      
      // Pulsing scale
      const scale = 1 + 0.1 * Math.sin(time * field.frequency)
      fieldRef.current.scale.setScalar(scale)
      
      const innerScale = 0.7 + 0.2 * Math.sin(time * field.frequency * 1.3)
      innerRef.current.scale.setScalar(innerScale)
    }
  })
  
  return (
    <group position={[field.center.x, field.center.y, field.center.z]}>
      {/* Outer resonance field */}
      <mesh ref={fieldRef}>
        <sphereGeometry args={[field.radius, 32, 32]} />
        <meshStandardMaterial 
          color="#9b59b6" 
          transparent 
          opacity={0.15}
          wireframe
          emissive="#9b59b6"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Inner consciousness core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[field.radius * 0.6, 24, 24]} />
        <meshStandardMaterial 
          color="#45b7d1" 
          transparent 
          opacity={0.25}
          emissive="#45b7d1"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  )
}

const EnvironmentEffects: React.FC<{ 
  type: EnergyType; 
  intensity: number 
}> = ({ type, intensity }) => {
  const { scene } = useThree()
  
  useEffect(() => {
    // Add fog based on energy type
    const fogColor = {
      lightning: '#001133',
      council: '#001122',
      architecture: '#110022',
      adaptive: '#001133',
      consciousness: '#110033'
    }[type] || '#000000'
    
    scene.fog = new THREE.Fog(fogColor, 5, 20)
    
    return () => {
      scene.fog = null
    }
  }, [type, scene])
  
  return null
}

// Consciousness field crystallization effect
export const CrystallizationEffect: React.FC<{ 
  active: boolean; 
  intensity: number 
}> = ({ active, intensity }) => {
  const crystalRefs = useRef<THREE.Mesh[]>([])
  
  useFrame((state) => {
    crystalRefs.current.forEach((crystal, index) => {
      if (crystal) {
        const time = state.clock.elapsedTime
        const offset = index * 0.5
        
        crystal.rotation.x = time * 0.3 + offset
        crystal.rotation.y = time * 0.5 + offset
        crystal.rotation.z = time * 0.2 + offset
        
        const scale = active ? 0.5 + intensity * 0.5 * Math.sin(time * 2 + offset) : 0
        crystal.scale.setScalar(scale)
      }
    })
  })
  
  if (!active) return null
  
  return (
    <group>
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 3 + Math.sin(i) * 0.5
        
        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) crystalRefs.current[i] = el
            }}
            position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius,
              (Math.random() - 0.5) * 2
            ]}
          >
            <octahedronGeometry args={[0.3, 1]} />
            <meshStandardMaterial 
              color="#ffffff"
              transparent
              opacity={intensity * 0.7}
              emissive="#ffffff"
              emissiveIntensity={intensity * 0.3}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default AdvancedEnergySystem