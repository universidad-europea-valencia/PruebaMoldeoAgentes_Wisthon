import React, { useState } from 'react'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import {
  Card,
  CardHeader,
  MetricCard,
  FormGroup,
  Input,
  Select,
  Button,
  ErrorMessage,
  SuccessMessage,
  LoadingSpinner,
  JSONViewer,
  StatusBadge,
} from './Shared'
import { mantenimientoIncident } from '../services/api'

export default function MantenimientoModule() {
  const [formData, setFormData] = useState({
    machine_id: 'CNC_1',
    new_status: 'averia',
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [useLLM, setUseLLM] = useState(false)

  const machineOptions = [
    { value: 'CNC_1', label: 'CNC 1' },
    { value: 'CNC_2', label: 'CNC 2' },
    { value: 'Robot_1', label: 'Robot 1' },
    { value: 'Manual_1', label: 'Manual 1' },
  ]

  const statusOptions = [
    { value: 'averia', label: '🔴 Avería (Breakdown)' },
    { value: 'operativo', label: '🟢 Operativo (Running)' },
    { value: 'mantenimiento', label: '🟡 Mantenimiento Planificado' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleIncident = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const payload = {
        ...formData,
        include_llm: useLLM
      }
      
      const response = await mantenimientoIncident(payload)
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const mapping = {
      averia: { status: 'error', label: 'Avería' },
      operativo: { status: 'operational', label: 'Operativo' },
      mantenimiento: { status: 'warning', label: 'Mantenimiento' },
    }
    return mapping[status] || mapping.averia
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Gestión de Incidentes de Mantenimiento"
          subtitle="Actualizar estado de máquina y gestionar rerouting automático"
          icon={AlertCircle}
        />
        
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}
        {result && (
          <SuccessMessage message="Incidente registrado exitosamente" onDismiss={() => setResult(null)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FormGroup label="Máquina" required>
            <Select
              name="machine_id"
              value={formData.machine_id}
              onChange={handleChange}
              options={machineOptions}
            />
          </FormGroup>

          <FormGroup label="Nuevo Estado" required>
            <Select
              name="new_status"
              value={formData.new_status}
              onChange={handleChange}
              options={statusOptions}
            />
          </FormGroup>

          <FormGroup label="Usar LLM para explicación">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useLLM}
                onChange={(e) => setUseLLM(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600">Incluir recomendaciones con IA</span>
            </label>
          </FormGroup>
        </div>

        <div className="flex gap-3">
          <Button 
            variant={formData.new_status === 'averia' ? 'danger' : 'primary'}
            onClick={handleIncident}
            disabled={loading}
          >
            {loading ? <LoadingSpinner /> : 'Registrar Incidente'}
          </Button>
        </div>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader
              title="Resultado del Incidente"
              subtitle="Impacto y acciones de mitigación"
            />
            
            {result.data && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MetricCard
                    label="Máquina"
                    value={result.data.machine_id}
                    status="normal"
                  />
                  <MetricCard
                    label="Estado"
                    value={result.data.new_status}
                    status={getStatusBadge(result.data.new_status).status}
                  />
                </div>

                {result.data.routes_affected && result.data.routes_affected.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-semibold text-red-800">Rutas Afectadas</h4>
                        <ul className="list-disc list-inside space-y-1 text-red-700 text-sm mt-2">
                          {result.data.routes_affected.map((route, idx) => (
                            <li key={idx}>{route}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {result.data.rerouting_available && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">✓ Rerouting Disponible</h4>
                    <p className="text-green-700 text-sm">
                      Las órdenes serán automáticamente reasignadas a máquinas alternativas.
                    </p>
                  </div>
                )}

                {result.data.incident_message && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Análisis del Incidente</h4>
                    <p className="text-blue-700 text-sm">{result.data.incident_message}</p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {result.llm && (
            <Card>
              <CardHeader
                title="Recomendaciones con IA"
                subtitle="Explicación y sugerencias del asistente"
              />
              
              <div className="space-y-4">
                {result.llm.reasoning && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Análisis</h4>
                    <p className="text-gray-700 leading-relaxed">{result.llm.reasoning}</p>
                  </div>
                )}
                
                {result.llm.immediate_actions && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Acciones Inmediatas</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {result.llm.immediate_actions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.llm.escalation_message && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm font-semibold">{result.llm.escalation_message}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title="Datos en JSON" />
            <JSONViewer data={result} />
          </Card>
        </>
      )}
    </div>
  )
}
