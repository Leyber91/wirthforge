import React, { useState } from 'react'
import { EnergyVisualization } from '../components/energy/EnergyVisualization'
import { useEnergyStore } from '../stores/energyStore'
import { useAchievements } from '../contexts/AchievementContext'

export const Level1Lightning: React.FC = () => {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { energyFlow, triggerLightningStrike, isGenerating } = useEnergyStore()
  const { unlockAchievement } = useAchievements()

  const handleGenerate = async () => {
    if (!query.trim()) return
    
    setIsLoading(true)
    triggerLightningStrike(query)
    
    try {
      // API call to backend
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query,
          level: 1,
          model: 'qwen3:0.6b'
        }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setResponse(data.response)
      
      // Unlock first lightning achievement
      unlockAchievement('first_lightning')
      
    } catch (error) {
      console.error('Generation error:', error)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setResponse('❌ Backend server not running. Please start the backend server.')
      } else {
        setResponse('⚡ Error generating response. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="level1-lightning min-h-screen bg-space-black text-energy-white">
      {/* Header */}
      <div className="p-6 border-b border-energy-blue/20">
        <h1 className="text-3xl font-bold text-energy-blue">
          Level 1: Lightning Strike
        </h1>
        <p className="text-energy-dim mt-2">
          Raw AI power - instant responses with electric energy
        </p>
      </div>

      {/* Main Interface */}
      <div className="flex flex-col lg:flex-row h-full">
        {/* Energy Visualization */}
        <div className="lg:w-2/3 p-6">
          <div className="bg-deep-space rounded-lg p-4 mb-6">
            <EnergyVisualization 
              energyFlow={energyFlow}
              width={800}
              height={400}
            />
          </div>
          
          {/* Input Section */}
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask me anything... Watch the lightning strike!"
                className="w-full p-4 bg-deep-space border border-energy-blue/30 rounded-lg text-energy-white placeholder-energy-dim resize-none focus:outline-none focus:border-energy-blue transition-colors"
                rows={3}
              />
              <div className="absolute bottom-2 right-2 text-energy-dim text-sm">
                {query.length}/1000
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isLoading || isGenerating || !query.trim()}
              className="energy-button w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Lightning...
                </span>
              ) : (
                '⚡ Generate Lightning Strike'
              )}
            </button>
          </div>
        </div>

        {/* Response Section */}
        <div className="lg:w-1/3 p-6 border-l border-energy-blue/20">
          <div className="bg-deep-space rounded-lg p-4 h-full">
            <h3 className="text-xl font-bold text-energy-blue mb-4">
              Lightning Response
            </h3>
            
            {response ? (
              <div className="prose prose-invert max-w-none">
                <div className="text-energy-white whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            ) : (
              <div className="text-energy-dim italic">
                Ask a question to see the lightning strike...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-deep-space border-t border-energy-blue/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-energy-dim">
              Model: <span className="text-energy-blue">qwen3:0.6b</span>
            </div>
            <div className="text-energy-dim">
              Status: <span className={isGenerating ? 'text-energy-blue' : 'text-energy-dim'}>
                {isGenerating ? 'Generating...' : 'Ready'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-energy-blue rounded-full animate-pulse"></div>
            <span className="text-energy-dim">Energy Flow Active</span>
          </div>
        </div>
      </div>
    </div>
  )
} 