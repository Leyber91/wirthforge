import React, { useState, useEffect } from 'react';
import DecipherEngine from '../components/animations/DecipherEngine';
import levelSchemas from '../data/levelSchemas.json';
import './DecipherInterface.css';

interface DecipherResult {
  transformation: any;
  energyPattern: any;
  consciousness: number;
  response: string;
  visualData: any;
}

const DecipherInterface: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentSublevel, setCurrentSublevel] = useState('1');
  const [activeModules, setActiveModules] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<DecipherResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ollama');
  const [consciousnessLevel, setConsciousnessLevel] = useState(0);
  const [totalEnergy, setTotalEnergy] = useState(0);
  
  // Get current level configuration
  const levelConfig = (levelSchemas.levels as any)[currentLevel.toString()];
  const sublevelConfig = levelConfig?.sublevels[currentSublevel];
  
  // Get available modules for current category
  const moduleDefinitions = levelSchemas.moduleDefinitions as any;
  const availableModules = Object.entries(moduleDefinitions)
    .filter(([_, config]: [string, any]) => config.category === selectedCategory)
    .map(([key, config]: [string, any]) => ({ key, ...config }));
  
  // Get required modules for current sublevel
  const requiredModules = sublevelConfig?.requiredModules || [];
  const optionalModules = sublevelConfig?.optionalModules || [];
  const missingModules = requiredModules.filter((module: string) => !activeModules.includes(module));
  
  // Handle level change
  const handleLevelChange = (level: number) => {
    setCurrentLevel(level);
    setCurrentSublevel(level === 3 ? '1A' : '1');
    setActiveModules([]);
    setResult(null);
  };
  
  // Handle sublevel change
  const handleSublevelChange = (sublevel: string) => {
    setCurrentSublevel(sublevel);
    setActiveModules([]);
    setResult(null);
  };
  
  // Handle module toggle
  const handleModuleToggle = (moduleKey: string) => {
    setActiveModules(prev => 
      prev.includes(moduleKey)
        ? prev.filter(m => m !== moduleKey)
        : [...prev, moduleKey]
    );
  };
  
  // Auto-fill missing modules
  const autoFillModules = () => {
    const newModules = [...activeModules];
    missingModules.forEach((module: string) => {
      if (!newModules.includes(module)) {
        newModules.push(module);
      }
    });
    setActiveModules(newModules);
  };
  
  // Handle decipher completion
  const handleDecipherComplete = (decipherResult: DecipherResult) => {
    setResult(decipherResult);
    setIsProcessing(false);
    setConsciousnessLevel(decipherResult.consciousness);
    setTotalEnergy(prev => prev + (decipherResult.energyPattern?.intensity || 0));
  };
  
  // Handle query execution
  const executeQuery = () => {
    if (!query.trim() || missingModules.length > 0) return;
    
    setIsProcessing(true);
    setResult(null);
    // The decipher engine will handle the execution
  };
  
  // Get sublevels for current level
  const getSublevels = () => {
    if (!levelConfig) return [];
    return Object.entries(levelConfig.sublevels).map(([key, config]: [string, any]) => ({
      key,
      ...config
    }));
  };
  
  // Calculate pipeline completeness
  const calculateCompleteness = () => {
    const totalRequired = requiredModules.length;
    const fulfilled = requiredModules.filter((module: string) => activeModules.includes(module)).length;
    return totalRequired > 0 ? (fulfilled / totalRequired) * 100 : 0;
  };
  
  return (
    <div className="decipher-interface">
      {/* Header */}
      <header className="interface-header">
        <div className="logo">
          <div className="logo-icon"></div>
          <h1>WIRTHFORGE</h1>
          <span className="subtitle">Energy-to-Consciousness Compiler</span>
        </div>
        
        <div className="consciousness-display">
          <div className="consciousness-meter">
            <div 
              className="consciousness-fill"
              style={{ width: `${consciousnessLevel}%` }}
            ></div>
          </div>
          <span className="consciousness-level">{consciousnessLevel}%</span>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="interface-content">
        {/* Level Selection */}
        <div className="level-section">
          <h2>Consciousness Levels</h2>
          <div className="level-grid">
            {[1, 2, 3, 4, 5].map(level => (
              <button
                key={level}
                className={`level-button level-${level} ${currentLevel === level ? 'active' : ''}`}
                onClick={() => handleLevelChange(level)}
              >
                <div className="level-number">{level}</div>
                <div className="level-name">
                  {(levelSchemas.levels as any)[level.toString()]?.name}
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Sublevel Selection */}
        <div className="sublevel-section">
          <h3>Level {currentLevel}: {levelConfig?.name}</h3>
          <div className="sublevel-grid">
            {getSublevels().map(sublevel => (
              <button
                key={sublevel.key}
                className={`sublevel-button ${currentSublevel === sublevel.key ? 'active' : ''}`}
                onClick={() => handleSublevelChange(sublevel.key)}
              >
                <div className="sublevel-key">{sublevel.key}</div>
                <div className="sublevel-name">{sublevel.name}</div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Module Selection */}
        <div className="module-section">
          <h3>Module Pipeline</h3>
          
          <div className="module-categories">
            {['ollama', 'built', 'emergent'].map(category => (
              <button
                key={category}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="module-grid">
            {availableModules.map(module => (
              <div
                key={module.key}
                className={`module-card ${module.category} ${activeModules.includes(module.key) ? 'active' : ''}`}
                onClick={() => handleModuleToggle(module.key)}
              >
                <div className="module-header">
                  <h4>{module.name}</h4>
                  <span className={`module-status ${
                    requiredModules.includes(module.key) ? 'required' : 
                    optionalModules.includes(module.key) ? 'optional' : 'available'
                  }`}>
                    {requiredModules.includes(module.key) ? 'Required' : 
                     optionalModules.includes(module.key) ? 'Optional' : 'Available'}
                  </span>
                </div>
                <p className="module-description">{module.description}</p>
                <div className="module-reality">{module.reality}</div>
              </div>
            ))}
          </div>
          
          {missingModules.length > 0 && (
            <div className="missing-modules">
              <h4>Missing Required Modules:</h4>
              <ul>
                               {missingModules.map((module: string) => (
                 <li key={module}>{moduleDefinitions[module]?.name || module}</li>
               ))}
              </ul>
              <button className="auto-fill-button" onClick={autoFillModules}>
                Auto-Fill Missing Modules
              </button>
            </div>
          )}
        </div>
        
        {/* Query Input */}
        <div className="query-section">
          <h3>Energy Input</h3>
          <div className="query-input-container">
            <textarea
              className="query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your query to transform into AI consciousness..."
              rows={4}
            />
            <button
              className="execute-button"
              onClick={executeQuery}
              disabled={!query.trim() || missingModules.length > 0 || isProcessing}
            >
              {isProcessing ? 'Deciphering...' : 'Transform Energy'}
            </button>
          </div>
          
          <div className="pipeline-status">
            <div className="completeness-bar">
              <div 
                className="completeness-fill"
                style={{ width: `${calculateCompleteness()}%` }}
              ></div>
            </div>
            <span>Pipeline Completeness: {Math.round(calculateCompleteness())}%</span>
          </div>
        </div>
        
        {/* Animation Canvas */}
        <div className="animation-section">
          <h3>Energy Transformation</h3>
          <div className="animation-container">
            <DecipherEngine
              currentLevel={currentLevel}
              currentSublevel={currentSublevel}
              activeModules={activeModules}
              query={query}
              onDecipherComplete={handleDecipherComplete}
            />
          </div>
        </div>
        
        {/* Results Display */}
        {result && (
          <div className="results-section">
            <h3>Consciousness Response</h3>
            <div className="result-container">
              <div className="transformation-info">
                <h4>Transformation Type:</h4>
                <p>{result.transformation.transformation}</p>
                <h4>Energy Signature:</h4>
                <p>{result.transformation.energySignature}</p>
                <h4>Consciousness Level:</h4>
                <p>{result.consciousness}%</p>
              </div>
              
              <div className="response-content">
                <h4>AI Response:</h4>
                <pre className="response-text">{result.response}</pre>
              </div>
            </div>
          </div>
        )}
        
        {/* Statistics */}
        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-value">{activeModules.length}</div>
            <div className="stat-label">Active Modules</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{totalEnergy}</div>
            <div className="stat-label">Total Energy</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{consciousnessLevel}%</div>
            <div className="stat-label">Consciousness</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecipherInterface;