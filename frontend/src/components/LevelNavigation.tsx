import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Level {
  id: number
  name: string
  path: string
  icon: string
  unlocked: boolean
  description: string
}

interface LevelNavigationProps {
  currentLevel?: number
  unlockedLevels?: number[]
}

const levels: Level[] = [
  {
    id: 1,
    name: 'Lightning',
    path: '/level1',
    icon: '⚡',
    unlocked: true,
    description: 'Discrete energy strikes'
  },
  {
    id: 2,
    name: 'Council',
    path: '/level2',
    icon: '🌊',
    unlocked: true,
    description: 'Parallel streams converge'
  },
  {
    id: 3,
    name: 'Architecture',
    path: '/level3',
    icon: '🏗️',
    unlocked: false,
    description: 'Structured energy networks'
  },
  {
    id: 4,
    name: 'Adaptive',
    path: '/level4',
    icon: '🧬',
    unlocked: false,
    description: 'Living energy systems'
  },
  {
    id: 5,
    name: 'Resonance',
    path: '/level5',
    icon: '🌌',
    unlocked: false,
    description: 'Consciousness fields'
  }
]

export const LevelNavigation: React.FC<LevelNavigationProps> = ({ 
  currentLevel, 
  unlockedLevels = [1, 2] 
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const getCurrentLevel = () => {
    if (currentLevel) return currentLevel
    
    const pathToLevel = {
      '/level1': 1,
      '/level2': 2,
      '/level3': 3,
      '/level4': 4,
      '/level5': 5
    }
    
    return pathToLevel[location.pathname as keyof typeof pathToLevel] || 1
  }

  const handleLevelChange = (level: Level) => {
    if (!unlockedLevels.includes(level.id)) {
      return // Don't navigate to locked levels
    }
    navigate(level.path)
  }

  const currentLevelId = getCurrentLevel()

  return (
    <div className="level-nav">
      <motion.div
        className="flex items-center space-x-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {levels.map((level) => {
          const isUnlocked = unlockedLevels.includes(level.id)
          const isCurrent = level.id === currentLevelId
          const isAccessible = level.id <= Math.max(...unlockedLevels) + 1

          return (
            <motion.button
              key={level.id}
              onClick={() => handleLevelChange(level)}
              disabled={!isUnlocked}
              className={`
                relative w-12 h-12 rounded-full border-2 transition-all duration-300
                ${isCurrent 
                  ? 'bg-energy-blue text-space-black border-energy-blue' 
                  : isUnlocked 
                    ? 'bg-transparent text-energy-blue border-energy-blue/50 hover:border-energy-blue hover:bg-energy-blue/20' 
                    : 'bg-transparent text-energy-dim border-energy-dim/30 cursor-not-allowed'
                }
              `}
              whileHover={isUnlocked ? { scale: 1.1 } : {}}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
            >
              <div className="flex flex-col items-center">
                <span className="text-lg leading-none">{level.icon}</span>
                <span className="text-xs leading-none">{level.id}</span>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-deep-space rounded-lg p-2 border border-energy-blue/30 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                <div className="text-xs font-medium text-energy-blue">{level.name}</div>
                <div className="text-xs text-energy-dim">{level.description}</div>
                {!isUnlocked && (
                  <div className="text-xs text-red-400 mt-1">🔒 Locked</div>
                )}
              </div>
            </motion.button>
          )
        })}
      </motion.div>
      
      {/* Energy Progress Bar */}
      <div className="mt-3 w-full bg-energy-blue/20 rounded-full h-1">
        <motion.div
          className="bg-energy-blue h-1 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(Math.max(...unlockedLevels) / levels.length) * 100}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>
      
      {/* Current Level Info */}
      <div className="mt-2 text-center">
        <div className="text-xs text-energy-dim">
          Level {currentLevelId}: {levels.find(l => l.id === currentLevelId)?.name}
        </div>
      </div>
    </div>
  )
}

export default LevelNavigation