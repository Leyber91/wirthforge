import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DoorSelection } from './pages/DoorSelection'
import { Level1Lightning } from './pages/Level1Lightning'
import { Level2Council } from './pages/Level2Council'
import { Level3Architecture } from './pages/Level3Architecture'
import { Level4Adaptive } from './pages/Level4Adaptive'
import { Level5Resonance } from './pages/Level5Resonance'
import { AchievementProvider } from './contexts/AchievementContext'

function App() {
  return (
    <Router>
      <AchievementProvider>
        <div className="App bg-space-black min-h-screen text-energy-white">
          <Routes>
            <Route path="/" element={<DoorSelection />} />
            <Route path="/level1" element={<Level1Lightning />} />
            <Route path="/level2" element={<Level2Council />} />
            <Route path="/level3" element={<Level3Architecture />} />
            <Route path="/level4" element={<Level4Adaptive />} />
            <Route path="/level5" element={<Level5Resonance />} />
          </Routes>
        </div>
      </AchievementProvider>
    </Router>
  )
}

export default App 