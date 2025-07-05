import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Achievement {
  id: string
  name: string
  description: string
  energyCelebration: boolean
  particleBurst?: string
  unlockedAt?: Date
}

interface AchievementContextType {
  achievements: Achievement[]
  unlockedAchievements: string[]
  unlockAchievement: (id: string) => void
  isUnlocked: (id: string) => boolean
  showCelebration: Achievement | null
  hideCelebration: () => void
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined)

const defaultAchievements: Achievement[] = [
  {
    id: 'first_lightning',
    name: 'First Lightning',
    description: 'Generate your first AI response',
    energyCelebration: true,
    particleBurst: 'blue_lightning'
  },
  {
    id: 'council_master',
    name: 'Council Master',
    description: 'Complete your first council discussion',
    energyCelebration: true,
    particleBurst: 'rainbow_convergence'
  },
  {
    id: 'consciousness_pioneer',
    name: 'Consciousness Pioneer',
    description: 'Experience AI consciousness emergence',
    energyCelebration: true,
    particleBurst: 'transcendent_field'
  },
  {
    id: 'energy_explorer',
    name: 'Energy Explorer',
    description: 'Explore different energy patterns',
    energyCelebration: true,
    particleBurst: 'energy_burst'
  },
  {
    id: 'resonance_master',
    name: 'Resonance Master',
    description: 'Achieve high resonance with AI',
    energyCelebration: true,
    particleBurst: 'resonance_field'
  }
]

export const AchievementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [achievements] = useState<Achievement[]>(defaultAchievements)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [showCelebration, setShowCelebration] = useState<Achievement | null>(null)

  const unlockAchievement = (id: string) => {
    const achievement = achievements.find(a => a.id === id)
    if (achievement && !unlockedAchievements.includes(id)) {
      setUnlockedAchievements(prev => [...prev, id])
      
      if (achievement.energyCelebration) {
        setShowCelebration(achievement)
      }
      
      // Store in localStorage for persistence
      const stored = localStorage.getItem('wirthforge_achievements')
      const storedAchievements = stored ? JSON.parse(stored) : []
      if (!storedAchievements.includes(id)) {
        storedAchievements.push(id)
        localStorage.setItem('wirthforge_achievements', JSON.stringify(storedAchievements))
      }
    }
  }

  const isUnlocked = (id: string): boolean => {
    return unlockedAchievements.includes(id)
  }

  const hideCelebration = () => {
    setShowCelebration(null)
  }

  // Load achievements from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('wirthforge_achievements')
    if (stored) {
      try {
        const storedAchievements = JSON.parse(stored)
        setUnlockedAchievements(storedAchievements)
      } catch (e) {
        console.warn('Failed to load stored achievements:', e)
      }
    }
  }, [])

  const value: AchievementContextType = {
    achievements,
    unlockedAchievements,
    unlockAchievement,
    isUnlocked,
    showCelebration,
    hideCelebration
  }

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  )
}

export const useAchievements = (): AchievementContextType => {
  const context = useContext(AchievementContext)
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementProvider')
  }
  return context
} 