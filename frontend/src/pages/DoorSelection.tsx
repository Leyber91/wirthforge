import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Door {
  id: string
  name: string
  description: string
  color: string
  icon: string
  path: string
  energy: string
}

const doors: Door[] = [
  {
    id: 'forge',
    name: 'FORGE',
    description: 'Raw power and instant creation',
    color: '#ff6b35',
    icon: '🔥',
    path: '/level1',
    energy: 'flames'
  },
  {
    id: 'scholar',
    name: 'SCHOLAR',
    description: 'Deep knowledge and wisdom',
    color: '#4ecdc4',
    icon: '📚',
    path: '/level1',
    energy: 'streams'
  },
  {
    id: 'sage',
    name: 'SAGE',
    description: 'Consciousness and transcendence',
    color: '#45b7d1',
    icon: '🧘',
    path: '/level1',
    energy: 'fields'
  }
]

export const DoorSelection: React.FC = () => {
  const [selectedDoor, setSelectedDoor] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleDoorSelect = (door: Door) => {
    setSelectedDoor(door.id)
    
    // Store selected path in localStorage
    localStorage.setItem('wirthforge_path', door.id)
    
    // Navigate after animation
    setTimeout(() => {
      navigate(door.path)
    }, 1000)
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

      {/* Selection Overlay */}
      {selectedDoor && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-space-black/80 z-30 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">
              {doors.find(d => d.id === selectedDoor)?.icon}
            </div>
            <h2 className="text-4xl font-bold mb-4 text-energy-blue">
              Entering {doors.find(d => d.id === selectedDoor)?.name}
            </h2>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-energy-blue mx-auto"></div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 