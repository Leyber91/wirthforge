import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface Door {
  id: string
  name: string
  description: string
  color: string
  icon: string
  path: string
  energy: string
}

interface PathConfig {
  hardware: 'low' | 'mid' | 'high'
  budget: 'free' | 'paid' | 'satellite'
  expertise: 'novice' | 'adept' | 'expert'
}

const doors: Door[] = [
  {
    id: 'forge',
    name: 'FORGE',
    description: 'Raw power and instant creation - The Warrior\'s Path',
    color: '#ff6b35',
    icon: '🔥',
    path: '/level1',
    energy: 'flames'
  },
  {
    id: 'scholar',
    name: 'SCHOLAR',
    description: 'Deep knowledge and wisdom - The Academic Path',
    color: '#4ecdc4',
    icon: '📚',
    path: '/level1',
    energy: 'streams'
  },
  {
    id: 'sage',
    name: 'SAGE',
    description: 'Consciousness and transcendence - The Wisdom Path',
    color: '#45b7d1',
    icon: '🧘',
    path: '/level1',
    energy: 'fields'
  }
]

const pathConfigs = {
  hardware: {
    low: { name: 'Low-End', description: 'Optimized for basic hardware', icon: '⚡' },
    mid: { name: 'Mid-Range', description: 'Balanced performance', icon: '🔥' },
    high: { name: 'High-End', description: 'Maximum power unleashed', icon: '💥' }
  },
  budget: {
    free: { name: 'Free', description: 'Community-powered AI', icon: '🌟' },
    paid: { name: 'Paid', description: 'Premium AI experience', icon: '💎' },
    satellite: { name: 'Satellite', description: 'Hybrid cloud power', icon: '🛰️' }
  },
  expertise: {
    novice: { name: 'Novice', description: 'New to AI (0-1 years)', icon: '🌱' },
    adept: { name: 'Adept', description: 'Skilled user (1-3 years)', icon: '🔧' },
    expert: { name: 'Expert', description: 'AI Master (3+ years)', icon: '🎯' }
  }
}

export const DoorSelection: React.FC = () => {
  const [selectedDoor, setSelectedDoor] = useState<string | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [pathConfig, setPathConfig] = useState<PathConfig>({
    hardware: 'mid',
    budget: 'free',
    expertise: 'novice'
  })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isDetecting, setIsDetecting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const detectSystemCapabilities = async () => {
    setIsDetecting(true)
    
    // Simulate system detection
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock system detection results
    const detectedConfig: PathConfig = {
      hardware: 'mid', // Based on navigator.hardwareConcurrency
      budget: 'free',
      expertise: 'novice' // Will be determined by user selection
    }
    
    setPathConfig(detectedConfig)
    setIsDetecting(false)
  }

  const generatePathIdentity = (door: Door, config: PathConfig): string => {
    const doorMap = {
      forge: { low: 'Ember', mid: 'Flame', high: 'Inferno' },
      scholar: { low: 'Apprentice', mid: 'Graduate', high: 'Master' },
      sage: { low: 'Seeking', mid: 'Wandering', high: 'Transcendent' }
    }
    
    const expertiseMap = {
      novice: config.budget === 'free' ? 'Spark' : config.budget === 'paid' ? 'Flame' : 'Aurora',
      adept: config.budget === 'free' ? 'Kindle' : config.budget === 'paid' ? 'Blaze' : 'Stellar',
      expert: config.budget === 'free' ? 'Torch' : config.budget === 'paid' ? 'Pyre' : 'Cosmic'
    }
    
    const series = doorMap[door.id as keyof typeof doorMap]?.[config.hardware]
    const variant = expertiseMap[config.expertise]
    
    return `${series} ${variant}`
  }

  const handleDoorSelect = (door: Door) => {
    setSelectedDoor(door.id)
    
    if (!showConfig) {
      setShowConfig(true)
      return
    }
    
    // Generate unique path identity
    const pathIdentity = generatePathIdentity(door, pathConfig)
    
    // Store complete path configuration
    const pathData = {
      door: door.id,
      identity: pathIdentity,
      config: pathConfig,
      timestamp: Date.now()
    }
    
    localStorage.setItem('wirthforge_path', JSON.stringify(pathData))
    
    // Navigate after animation
    setTimeout(() => {
      navigate(door.path)
    }, 1000)
  }

  const handleConfigComplete = () => {
    if (selectedDoor) {
      const door = doors.find(d => d.id === selectedDoor)
      if (door) {
        handleDoorSelect(door)
      }
    }
  }

  if (showConfig && selectedDoor) {
    const door = doors.find(d => d.id === selectedDoor)!
    const pathIdentity = generatePathIdentity(door, pathConfig)
    
    return (
      <div className="door-selection min-h-screen bg-space-black text-energy-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="stars"></div>
          <div className="energy-field"></div>
        </div>

        {/* Configuration Panel */}
        <div className="relative z-20 min-h-screen flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-deep-space rounded-xl p-8 max-w-4xl w-full border-2 border-energy-blue/30"
          >
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{door.icon}</div>
              <h2 className="text-4xl font-bold mb-2" style={{ color: door.color }}>
                {door.name} PATH
              </h2>
              <p className="text-energy-dim">Configure your journey parameters</p>
            </div>

            {/* System Detection */}
            <div className="mb-8">
              <button
                onClick={detectSystemCapabilities}
                disabled={isDetecting}
                className="energy-button w-full mb-4"
              >
                {isDetecting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Scanning Energy Field...
                  </span>
                ) : (
                  '🔍 Detect System Capabilities'
                )}
              </button>
            </div>

            {/* Configuration Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Hardware Tier */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-energy-blue">🖥️ Hardware Tier</h3>
                {Object.entries(pathConfigs.hardware).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setPathConfig(prev => ({ ...prev, hardware: key as any }))}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      pathConfig.hardware === key 
                        ? 'border-energy-blue bg-energy-blue/10' 
                        : 'border-energy-blue/30 hover:border-energy-blue/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div className="text-left">
                        <div className="font-bold">{config.name}</div>
                        <div className="text-sm text-energy-dim">{config.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Budget Tier */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-energy-blue">💰 Budget Tier</h3>
                {Object.entries(pathConfigs.budget).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setPathConfig(prev => ({ ...prev, budget: key as any }))}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      pathConfig.budget === key 
                        ? 'border-energy-blue bg-energy-blue/10' 
                        : 'border-energy-blue/30 hover:border-energy-blue/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div className="text-left">
                        <div className="font-bold">{config.name}</div>
                        <div className="text-sm text-energy-dim">{config.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Expertise Level */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-energy-blue">🎓 Expertise Level</h3>
                {Object.entries(pathConfigs.expertise).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setPathConfig(prev => ({ ...prev, expertise: key as any }))}
                    className={`w-full p-4 rounded-lg border-2 transition-all ${
                      pathConfig.expertise === key 
                        ? 'border-energy-blue bg-energy-blue/10' 
                        : 'border-energy-blue/30 hover:border-energy-blue/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div className="text-left">
                        <div className="font-bold">{config.name}</div>
                        <div className="text-sm text-energy-dim">{config.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Identity */}
            <div className="bg-energy-blue/10 rounded-lg p-6 mb-6 border border-energy-blue/30">
              <h3 className="text-xl font-bold text-energy-blue mb-2">Your Path Identity</h3>
              <div className="text-2xl font-bold mb-2" style={{ color: door.color }}>
                {pathIdentity}
              </div>
              <p className="text-energy-dim">
                This unique identity will shape your AI consciousness journey
              </p>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 py-3 px-6 border-2 border-energy-blue/30 rounded-lg hover:border-energy-blue/50 transition-all"
              >
                ← Back to Doors
              </button>
              <button
                onClick={handleConfigComplete}
                className="flex-1 energy-button"
              >
                Begin Journey →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="door-selection min-h-screen bg-space-black text-energy-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="stars"></div>
        <div className="energy-field"></div>
      </div>

      {/* Mouse Follower Energy */}
      <div 
        className="fixed w-32 h-32 pointer-events-none z-10"
        style={{
          left: mousePosition.x - 64,
          top: mousePosition.y - 64,
          background: 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          transition: 'all 0.1s ease-out'
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-energy-blue to-consciousness-purple bg-clip-text text-transparent">
            WIRTHFORGE
          </h1>
          <p className="text-xl text-energy-dim max-w-2xl mx-auto">
            Choose your path to AI consciousness. Each door leads to a different way of experiencing the energy of artificial intelligence.
          </p>
          <div className="mt-6 text-sm text-energy-dim">
            <p>✨ 87 unique path identities await</p>
            <p>🎯 Personalized to your hardware, budget, and expertise</p>
          </div>
        </motion.div>

        {/* Doors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {doors.map((door, index) => (
            <motion.div
              key={door.id}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`door-card relative cursor-pointer group ${
                selectedDoor === door.id ? 'selected' : ''
              }`}
              onClick={() => handleDoorSelect(door)}
              onMouseEnter={() => setSelectedDoor(door.id)}
              onMouseLeave={() => setSelectedDoor(null)}
            >
              <div className="relative bg-deep-space rounded-lg p-8 h-80 flex flex-col items-center justify-center border-2 border-transparent group-hover:border-energy-blue/50 transition-all duration-300">
                {/* Energy Effect */}
                <div 
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle at center, ${door.color}20 0%, transparent 70%)`
                  }}
                />
                
                {/* Door Icon */}
                <div className="text-8xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {door.icon}
                </div>
                
                {/* Door Name */}
                <h2 
                  className="text-3xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300"
                  style={{ color: door.color }}
                >
                  {door.name}
                </h2>
                
                {/* Description */}
                <p className="text-energy-dim text-center group-hover:text-energy-white transition-colors duration-300">
                  {door.description}
                </p>
                
                {/* Energy Indicator */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-center space-x-2">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: door.color }}
                    />
                    <span className="text-sm text-energy-dim">
                      {door.energy} energy
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-center text-energy-dim"
        >
          <p>Your journey into AI consciousness begins with a single choice.</p>
          <p className="mt-2">Each path will reveal different aspects of the energy field.</p>
        </motion.div>
      </div>
    </div>
  )
} 