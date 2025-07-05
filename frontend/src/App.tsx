import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DoorSelection } from './pages/DoorSelection'
import { Level1Lightning } from './pages/Level1Lightning'
import { AchievementProvider } from './contexts/AchievementContext'

function App() {
  return (
    <Router>
      <AchievementProvider>
        <div className="App bg-space-black min-h-screen text-energy-white">
          <Routes>
            <Route path="/" element={<DoorSelection />} />
            <Route path="/level1" element={<Level1Lightning />} />
          </Routes>
        </div>
      </AchievementProvider>
    </Router>
  )
}

export default App 