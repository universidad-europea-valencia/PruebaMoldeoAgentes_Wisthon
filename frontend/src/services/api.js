import axios from 'axios'

const API_BASE_URL = 'http://localhost:8001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000
})

// Fusion Agent
export const fusionPlan = (payload) =>
  api.post('/fusion/plan', payload)

// Macheria Agent
export const macheryaAnalyze = (payload) =>
  api.post('/macheria/analyze', payload)

// Linea Agent
export const lineaPlan = (payload) =>
  api.post('/linea/plan', payload)

// Calidad Agent
export const calidadReplenish = (payload) =>
  api.post('/calidad/replenish', payload)

// Mantenimiento Agent
export const mantenimientoIncident = (payload) =>
  api.post('/mantenimiento/incident', payload)

// Orchestrator
export const orchestratorPlanning = (payload) =>
  api.post('/orchestrator/planning', payload)

export const orchestratorReactive = (payload) =>
  api.post('/orchestrator/reactive', payload)

// Health check
export const healthCheck = () =>
  api.get('/health')

export default api
