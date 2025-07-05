from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import logging
import asyncio
import json
from typing import List

logger = logging.getLogger(__name__)

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"🔗 WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"🔗 WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                # Remove dead connections
                self.active_connections.remove(connection)

manager = ConnectionManager()

@router.websocket("/energy")
async def websocket_energy_stream(websocket: WebSocket):
    """WebSocket endpoint for real-time energy streaming"""
    await manager.connect(websocket)
    
    try:
        # Send initial energy status
        initial_status = {
            "type": "energy_status",
            "data": {
                "energy_flow": "active",
                "particle_systems": "operational",
                "consciousness_level": 1,
                "timestamp": asyncio.get_event_loop().time()
            }
        }
        await manager.send_personal_message(json.dumps(initial_status), websocket)
        
        # Start energy simulation loop
        asyncio.create_task(energy_simulation_loop(websocket))
        
        while True:
            # Listen for client messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "generate_lightning":
                await handle_lightning_generation(websocket, message.get("data", {}))
            elif message.get("type") == "start_council":
                await handle_council_formation(websocket, message.get("data", {}))
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def energy_simulation_loop(websocket: WebSocket):
    """Simulate energy particles and flows"""
    try:
        while True:
            # Generate random energy particles
            particle_data = {
                "type": "energy_particles",
                "data": {
                    "particles": [
                        {
                            "id": f"particle_{i}",
                            "position": {"x": 0, "y": 0, "z": 0},
                            "velocity": {"x": 0.1, "y": 0.2, "z": 0},
                            "color": "#00ffff",
                            "lifetime": 3.0,
                            "energy": 1.0
                        } for i in range(5)
                    ],
                    "timestamp": asyncio.get_event_loop().time()
                }
            }
            
            await manager.send_personal_message(json.dumps(particle_data), websocket)
            await asyncio.sleep(0.1)  # 10 FPS updates
            
    except Exception as e:
        logger.error(f"Energy simulation error: {e}")

async def handle_lightning_generation(websocket: WebSocket, data: dict):
    """Handle lightning strike generation"""
    try:
        query = data.get("query", "")
        
        # Simulate lightning strike
        lightning_data = {
            "type": "lightning_strike",
            "data": {
                "start": {"x": -3, "y": -2, "z": 0},
                "end": {"x": 0, "y": 0, "z": 0},
                "color": "#00ffff",
                "duration": 0.5,
                "intensity": 1.0,
                "branches": [
                    [{"x": -3, "y": -2, "z": 0}, {"x": -1, "y": -1, "z": 0}, {"x": 0, "y": 0, "z": 0}]
                ],
                "query": query,
                "timestamp": asyncio.get_event_loop().time()
            }
        }
        
        await manager.send_personal_message(json.dumps(lightning_data), websocket)
        
        # Send particle burst
        burst_data = {
            "type": "particle_burst",
            "data": {
                "center": {"x": 0, "y": 0, "z": 0},
                "count": len(query) * 2,
                "color": "#00ffff",
                "energy": 1.5,
                "timestamp": asyncio.get_event_loop().time()
            }
        }
        
        await manager.send_personal_message(json.dumps(burst_data), websocket)
        
    except Exception as e:
        logger.error(f"Lightning generation error: {e}")

async def handle_council_formation(websocket: WebSocket, data: dict):
    """Handle council formation visualization"""
    try:
        query = data.get("query", "")
        
        # Simulate council streams
        council_data = {
            "type": "council_formation",
            "data": {
                "streams": [
                    {
                        "model": "qwen3:0.6b",
                        "color": "#00ffff",
                        "path": [{"x": -2, "y": 2, "z": 0}, {"x": 0, "y": 0, "z": 0}],
                        "energy_type": "lightning"
                    },
                    {
                        "model": "qwen3:1.7b", 
                        "color": "#4ecdc4",
                        "path": [{"x": 2, "y": 2, "z": 0}, {"x": 0, "y": 0, "z": 0}],
                        "energy_type": "stream"
                    },
                    {
                        "model": "qwen3:4b",
                        "color": "#ff6b35",
                        "path": [{"x": 0, "y": -2, "z": 0}, {"x": 0, "y": 0, "z": 0}],
                        "energy_type": "field"
                    }
                ],
                "convergence_point": {"x": 0, "y": 0, "z": 0},
                "harmony_level": 0.0,
                "query": query,
                "timestamp": asyncio.get_event_loop().time()
            }
        }
        
        await manager.send_personal_message(json.dumps(council_data), websocket)
        
        # Simulate harmony building over time
        for i in range(10):
            harmony_update = {
                "type": "harmony_update",
                "data": {
                    "harmony_level": (i + 1) / 10,
                    "convergence_energy": 0.5 + (i * 0.05),
                    "timestamp": asyncio.get_event_loop().time()
                }
            }
            await manager.send_personal_message(json.dumps(harmony_update), websocket)
            await asyncio.sleep(0.3)
        
        # Final synthesis
        synthesis_data = {
            "type": "council_synthesis",
            "data": {
                "synthesis_achieved": True,
                "energy_crystallization": True,
                "consciousness_level": 2,
                "timestamp": asyncio.get_event_loop().time()
            }
        }
        
        await manager.send_personal_message(json.dumps(synthesis_data), websocket)
        
    except Exception as e:
        logger.error(f"Council formation error: {e}") 