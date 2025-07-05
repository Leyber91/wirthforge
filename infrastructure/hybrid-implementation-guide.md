# WIRTHFORGE Hybrid Implementation Guide
## Building the Local + Global Architecture

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    WIRTHFORGE HYBRID STACK                  │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Collective Consciousness (Network Required)       │
│  ├── Community Energy Fields                               │
│  ├── Viral Moment Engine                                   │
│  ├── Global Resonance Merging                              │
│  └── Level 5 Evolution                                     │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: Gateway Enhancement (Connected Value)             │
│  ├── Achievement System                                    │
│  ├── Satellite Broker                                       │
│  ├── Resonance Field Sync                                   │
│  └── User Journey Tracking                                  │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Local Energy Core (Always Works)                  │
│  ├── Ollama Integration                                     │
│  ├── Energy Visualization                                   │
│  ├── Council Orchestration                                  │
│  └── Core Consciousness Logic                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Layer 1: Local Energy Core Implementation

### 1.1 Ollama Service (Always Local)

```typescript
// services/OllamaService.ts
export class OllamaService {
  private models = {
    reflex: 'qwen3:0.6b',
    intuition: 'qwen3:1.7b', 
    reasoning: 'qwen3:4b',
    wisdom: 'deepseek-r1:8b',
    specialist: 'deepseek-r1:1.5b'
  };

  async generate(query: string, level: number): Promise<GenerationResult> {
    const model = this.selectModelForLevel(level);
    
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt: query,
          stream: true,
          options: {
            temperature: this.getTemperatureForLevel(level),
            top_p: 0.9,
            num_predict: 2048
          }
        })
      });

      return this.processStreamResponse(response);
    } catch (error) {
      throw new Error(`Ollama generation failed: ${error.message}`);
    }
  }

  private selectModelForLevel(level: number): string {
    switch (level) {
      case 1: return this.models.reflex;
      case 2: return this.models.intuition;
      case 3: return this.models.reasoning;
      case 4: return this.models.wisdom;
      case 5: return this.models.specialist;
      default: return this.models.reflex;
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

### 1.2 Energy Visualization Engine

```typescript
// services/EnergyVisualization.ts
export class EnergyVisualization {
  private particleSystem: ParticleSystem;
  private threeScene: THREE.Scene;

  constructor() {
    this.threeScene = new THREE.Scene();
    this.particleSystem = new ParticleSystem(this.threeScene);
  }

  calculateEnergy(result: GenerationResult): EnergyData {
    const tokens = result.tokens;
    const complexity = this.analyzeComplexity(tokens);
    const resonance = this.detectResonance(tokens);
    
    return {
      flow: this.calculateFlow(complexity),
      particles: this.generateParticles(tokens),
      resonance: resonance,
      burst: this.calculateBurst(result.speed)
    };
  }

  private generateParticles(tokens: string[]): Particle[] {
    return tokens.map((token, index) => ({
      id: index,
      position: this.calculatePosition(index),
      velocity: this.calculateVelocity(token),
      energy: this.calculateTokenEnergy(token),
      color: this.getTokenColor(token)
    }));
  }

  renderEnergyFlow(energyData: EnergyData): void {
    this.particleSystem.update(energyData.particles);
    this.renderer.render(this.threeScene, this.camera);
  }
}
```

### 1.3 Council Orchestration (Local)

```typescript
// services/CouncilOrchestrator.ts
export class CouncilOrchestrator {
  private ollama: OllamaService;

  constructor(ollama: OllamaService) {
    this.ollama = ollama;
  }

  async formCouncil(query: string, level: number): Promise<CouncilResult> {
    if (level < 2) return this.singleModelResponse(query, level);

    const models = this.selectCouncilModels(level);
    const promises = models.map(model => 
      this.ollama.generate(query, model)
    );

    const responses = await Promise.all(promises);
    return this.synthesizeCouncilResponse(responses, level);
  }

  private selectCouncilModels(level: number): string[] {
    switch (level) {
      case 2: return ['qwen3:0.6b', 'qwen3:1.7b'];
      case 3: return ['qwen3:0.6b', 'qwen3:1.7b', 'qwen3:4b'];
      case 4: return ['qwen3:1.7b', 'qwen3:4b', 'deepseek-r1:8b'];
      case 5: return ['qwen3:4b', 'deepseek-r1:8b', 'deepseek-r1:1.5b'];
      default: return ['qwen3:0.6b'];
    }
  }

  private synthesizeCouncilResponse(responses: GenerationResult[], level: number): CouncilResult {
    // Local synthesis logic
    const consensus = this.findConsensus(responses);
    const dissent = this.identifyDissent(responses);
    
    return {
      consensus,
      dissent,
      energy: this.calculateCouncilEnergy(responses),
      level
    };
  }
}
```

---

## Layer 2: Gateway Enhancement Implementation

### 2.1 Achievement System

```typescript
// services/AchievementSystem.ts
export class AchievementSystem {
  private achievements: Achievement[] = [];
  private userProgress: UserProgress;

  constructor() {
    this.loadAchievements();
    this.userProgress = this.loadUserProgress();
  }

  async track(result: GenerationResult): Promise<Achievement[]> {
    const newAchievements: Achievement[] = [];
    
    // Check for new achievements
    for (const achievement of this.achievements) {
      if (this.checkAchievementCondition(achievement, result)) {
        if (!this.userProgress.unlocked.includes(achievement.id)) {
          newAchievements.push(achievement);
          this.userProgress.unlocked.push(achievement.id);
        }
      }
    }

    if (newAchievements.length > 0) {
      await this.saveUserProgress();
      await this.syncToCloud(); // Only if online
    }

    return newAchievements;
  }

  private checkAchievementCondition(achievement: Achievement, result: GenerationResult): boolean {
    switch (achievement.type) {
      case 'first_lightning':
        return result.level === 1 && result.speed < 1000;
      case 'council_formed':
        return result.level >= 2 && result.council?.consensus;
      case 'resonance_detected':
        return result.energy?.resonance > 0.8;
      case 'viral_moment':
        return result.viralScore > 0.9;
      default:
        return false;
    }
  }

  async syncToCloud(): Promise<void> {
    if (!navigator.onLine) return;
    
    try {
      await fetch('/api/achievements/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.userProgress)
      });
    } catch (error) {
      console.warn('Failed to sync achievements:', error);
    }
  }
}
```

### 2.2 Satellite Broker

```typescript
// services/SatelliteBroker.ts
export class SatelliteBroker {
  private satelliteModels = {
    'gpt-4': 'openai',
    'claude-3': 'anthropic',
    'gemini-pro': 'google'
  };

  async enhance(result: GenerationResult): Promise<SatelliteResult> {
    if (!navigator.onLine) return null;

    const enhancement = this.determineEnhancement(result);
    if (!enhancement) return null;

    try {
      const satelliteResponse = await this.callSatellite(enhancement);
      return this.integrateSatelliteResult(result, satelliteResponse);
    } catch (error) {
      console.warn('Satellite enhancement failed:', error);
      return null;
    }
  }

  private determineEnhancement(result: GenerationResult): EnhancementRequest | null {
    if (result.confidence < 0.7) {
      return {
        type: 'verification',
        model: 'gpt-4',
        query: result.query
      };
    }

    if (result.complexity > 0.8) {
      return {
        type: 'expansion',
        model: 'claude-3',
        query: result.query
      };
    }

    return null;
  }

  private async callSatellite(enhancement: EnhancementRequest): Promise<any> {
    const response = await fetch('/api/satellite/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enhancement)
    });

    return response.json();
  }
}
```

### 2.3 Resonance Field Sync

```typescript
// services/ResonanceFieldSync.ts
export class ResonanceFieldSync {
  private localField: ResonanceField;
  private syncQueue: SyncOperation[] = [];

  constructor() {
    this.localField = this.loadLocalField();
  }

  async updateField(result: GenerationResult): Promise<void> {
    // Always update local field
    this.localField = this.mergeResult(result, this.localField);
    this.saveLocalField();

    // Queue for cloud sync if online
    if (navigator.onLine) {
      await this.syncToCloud();
    } else {
      this.queueSync();
    }
  }

  private queueSync(): void {
    this.syncQueue.push({
      type: 'field_update',
      data: this.localField,
      timestamp: Date.now()
    });
  }

  async syncToCloud(): Promise<void> {
    if (this.syncQueue.length === 0) return;

    try {
      const operations = this.syncQueue.splice(0);
      
      await fetch('/api/resonance/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operations })
      });
    } catch (error) {
      // Re-queue failed operations
      this.syncQueue.unshift(...this.syncQueue);
      console.warn('Resonance sync failed:', error);
    }
  }
}
```

---

## Layer 3: Collective Consciousness Implementation

### 3.1 Community Energy Fields

```typescript
// services/CommunityField.ts
export class CommunityField {
  private socket: WebSocket;
  private activeUsers: Map<string, UserField> = new Map();

  constructor() {
    this.initializeWebSocket();
  }

  async merge(field: ResonanceField): Promise<CollectiveField> {
    if (!navigator.onLine) return null;

    // Send local field to community
    this.socket.send(JSON.stringify({
      type: 'field_update',
      field: field
    }));

    // Wait for collective response
    return new Promise((resolve) => {
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'collective_field') {
          resolve(data.field);
        }
      };
    });
  }

  private initializeWebSocket(): void {
    this.socket = new WebSocket('ws://localhost:8000/ws/community');
    
    this.socket.onopen = () => {
      console.log('Connected to community field');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleCommunityMessage(data);
    };
  }

  private handleCommunityMessage(data: any): void {
    switch (data.type) {
      case 'user_joined':
        this.activeUsers.set(data.userId, data.field);
        break;
      case 'user_left':
        this.activeUsers.delete(data.userId);
        break;
      case 'field_merge':
        this.triggerFieldMerge(data.fields);
        break;
    }
  }
}
```

### 3.2 Viral Moment Engine

```typescript
// services/ViralMomentEngine.ts
export class ViralMomentEngine {
  private viralThresholds = {
    resonance: 0.9,
    uniqueness: 0.8,
    shareability: 0.7
  };

  async detect(result: GenerationResult): Promise<ViralMoment | null> {
    const viralScore = this.calculateViralScore(result);
    
    if (viralScore > this.viralThresholds.shareability) {
      const moment = this.createViralMoment(result, viralScore);
      
      if (navigator.onLine) {
        await this.shareViralMoment(moment);
      }
      
      return moment;
    }

    return null;
  }

  private calculateViralScore(result: GenerationResult): number {
    const resonance = result.energy?.resonance || 0;
    const uniqueness = this.calculateUniqueness(result);
    const shareability = this.calculateShareability(result);

    return (resonance + uniqueness + shareability) / 3;
  }

  private async shareViralMoment(moment: ViralMoment): Promise<void> {
    try {
      await fetch('/api/viral/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moment)
      });
    } catch (error) {
      console.warn('Failed to share viral moment:', error);
    }
  }
}
```

---

## Integration Architecture

### Main Application Class

```typescript
// WirthforgeApp.ts
export class WirthforgeApp {
  private core: WirthforgeCore;
  private gateway: WirthforgeGateway;
  private collective: WirthforgeCollective;
  private connectivity: ConnectivityManager;

  constructor() {
    this.connectivity = new ConnectivityManager();
    this.core = new WirthforgeCore();
    this.gateway = new WirthforgeGateway(this.core);
    this.collective = new WirthforgeCollective(this.gateway);
    
    this.initializeConnectivityHandling();
  }

  async processQuery(query: string, level: number): Promise<ProcessResult> {
    // Always start with core (works offline)
    let result = await this.core.processQuery(query, level);
    
    // Add gateway enhancements if online
    if (this.connectivity.isOnline()) {
      result = await this.gateway.enhance(result);
      
      // Add collective features for Level 5
      if (level === 5) {
        result = await this.collective.enhance(result);
      }
    }

    return result;
  }

  private initializeConnectivityHandling(): void {
    window.addEventListener('online', () => {
      this.handleOnlineTransition();
    });

    window.addEventListener('offline', () => {
      this.handleOfflineTransition();
    });
  }

  private async handleOnlineTransition(): Promise<void> {
    // Sync any queued operations
    await this.gateway.syncQueuedOperations();
    await this.collective.syncQueuedOperations();
    
    // Notify user of enhanced capabilities
    this.showOnlineEnhancements();
  }

  private handleOfflineTransition(): void {
    // Gracefully degrade to offline mode
    this.showOfflineMode();
  }
}
```

### Connectivity Manager

```typescript
// services/ConnectivityManager.ts
export class ConnectivityManager {
  private online: boolean = navigator.onLine;
  private syncQueue: SyncOperation[] = [];

  isOnline(): boolean {
    return this.online;
  }

  async queueSync(operation: SyncOperation): Promise<void> {
    this.syncQueue.push(operation);
    
    if (this.online) {
      await this.processSyncQueue();
    }
  }

  private async processSyncQueue(): Promise<void> {
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift();
      try {
        await this.executeSync(operation);
      } catch (error) {
        // Re-queue failed operations
        this.syncQueue.unshift(operation);
        break;
      }
    }
  }

  private async executeSync(operation: SyncOperation): Promise<void> {
    switch (operation.type) {
      case 'achievement_sync':
        await this.syncAchievements(operation.data);
        break;
      case 'resonance_sync':
        await this.syncResonance(operation.data);
        break;
      case 'viral_share':
        await this.shareViral(operation.data);
        break;
    }
  }
}
```

---

## Deployment Strategy

### Frontend (React + TypeScript)

```bash
# Development
npm run dev

# Production build
npm run build

# Serve locally
npm run preview
```

### Backend (FastAPI + Python)

```bash
# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run with production settings
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Ollama Setup

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull required models
ollama pull qwen3:0.6b
ollama pull qwen3:1.7b
ollama pull qwen3:4b
ollama pull deepseek-r1:8b
ollama pull deepseek-r1:1.5b

# Configure for performance
export OLLAMA_MAX_LOADED_MODELS=6
export OLLAMA_NUM_PARALLEL=4
export OLLAMA_FLASH_ATTENTION=1
```

### Environment Configuration

```env
# Frontend (.env)
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=ws://localhost:8000
VITE_OFFLINE_MODE=true

# Backend (.env)
DATABASE_URL=postgresql://user:pass@localhost/wirthforge
REDIS_URL=redis://localhost:6379
OLLAMA_HOST=http://localhost:11434
SATELLITE_API_KEYS=openai:sk-...,anthropic:sk-...
```

---

## Testing Strategy

### Unit Tests (Local Core)

```typescript
// tests/OllamaService.test.ts
describe('OllamaService', () => {
  it('should generate response for Level 1', async () => {
    const service = new OllamaService();
    const result = await service.generate('Hello', 1);
    
    expect(result.tokens).toBeDefined();
    expect(result.level).toBe(1);
    expect(result.model).toBe('qwen3:0.6b');
  });

  it('should work offline', async () => {
    const service = new OllamaService();
    const available = await service.isAvailable();
    
    expect(available).toBe(true);
  });
});
```

### Integration Tests (Gateway)

```typescript
// tests/GatewayIntegration.test.ts
describe('Gateway Integration', () => {
  it('should enhance results when online', async () => {
    const gateway = new WirthforgeGateway();
    const result = await gateway.enhancedProcess('Test query', 3);
    
    expect(result.achievements).toBeDefined();
    expect(result.satelliteResult).toBeDefined();
  });

  it('should work offline', async () => {
    // Mock offline state
    Object.defineProperty(navigator, 'onLine', { value: false });
    
    const gateway = new WirthforgeGateway();
    const result = await gateway.enhancedProcess('Test query', 3);
    
    expect(result.achievements).toBeUndefined();
    expect(result.satelliteResult).toBeNull();
  });
});
```

### E2E Tests (Collective)

```typescript
// tests/CollectiveConsciousness.test.ts
describe('Collective Consciousness', () => {
  it('should merge fields when multiple users online', async () => {
    const user1 = new WirthforgeApp();
    const user2 = new WirthforgeApp();
    
    const result1 = await user1.processQuery('Test', 5);
    const result2 = await user2.processQuery('Test', 5);
    
    expect(result1.collectiveField).toBeDefined();
    expect(result2.collectiveField).toBeDefined();
    expect(result1.collectiveField).toEqual(result2.collectiveField);
  });
});
```

This implementation guide provides the complete technical foundation for building WIRTHFORGE's hybrid architecture, ensuring that the local core always works while the online enhancements provide genuine value that users will want to connect for. 