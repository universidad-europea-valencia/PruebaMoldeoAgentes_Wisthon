import React, { useState } from 'react'
import { Activity, AlertTriangle, Zap } from 'lucide-react'
import {
  Card,
  CardHeader,
  MetricCard,
  FormGroup,
  Input,
  Button,
  ErrorMessage,
  SuccessMessage,
  LoadingSpinner,
  JSONViewer,
} from './Shared'
import { macheryaAnalyze } from '../services/api'

export default function MacheryaModule() {
  const [formData, setFormData] = useState({
    molding_rate_per_hour: 300,
    core_rate_per_hour_per_machine: 50,
    current_core_stock: 200,
    safety_buffer_hours: 4,
    horizon_hours: 8,
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [useLLM, setUseLLM] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || value
    }))
  }

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const payload = {
        ...formData,
        include_llm: useLLM
      }
      
      const response = await macheryaAnalyze(payload)
      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Análisis de Machería"
          subtitle="Optimización del cuello de botella en producción de machos"
          icon={Zap}
        />
        
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}
        {result && (
          <SuccessMessage message="Análisis completado exitosamente" onDismiss={() => setResult(null)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FormGroup label="Tasa de moldeo (piezas/hora)" required>
            <Input
              type="number"
              name="molding_rate_per_hour"
              value={formData.molding_rate_per_hour}
              onChange={handleChange}
              min="0"
            />
          </FormGroup>

          <FormGroup label="Tasa de núcleos por máquina (núcleos/hora)" required>
            <Input
              type="number"
              name="core_rate_per_hour_per_machine"
              value={formData.core_rate_per_hour_per_machine}
              onChange={handleChange}
              min="0"
            />
          </FormGroup>

          <FormGroup label="Stock actual de núcleos" required>
            <Input
              type="number"
              name="current_core_stock"
              value={formData.current_core_stock}
              onChange={handleChange}
              min="0"
            />
          </FormGroup>

          <FormGroup label="Horas de seguridad" required>
            <Input
              type="number"
              name="safety_buffer_hours"
              value={formData.safety_buffer_hours}
              onChange={handleChange}
              min="0"
              step="0.5"
            />
          </FormGroup>

          <FormGroup label="Horizonte de análisis (horas)" required>
            <Input
              type="number"
              name="horizon_hours"
              value={formData.horizon_hours}
              onChange={handleChange}
              min="0"
              step="0.5"
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
          <Button variant="primary" onClick={handleAnalyze} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Analizar Capacidad'}
          </Button>
        </div>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader
              title="Resultados del Análisis"
              subtitle="Métricas de capacidad y bottleneck"
              icon={Activity}
            />
            
            {result.data && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  label="Máquinas Operativas"
                  value={result.data.machines_operative || 0}
                  status="normal"
                />
                <MetricCard
                  label="Capacidad Total (unidades/h)"
                  value={result.data.total_core_capacity || 0}
                  status="normal"
                />
                <MetricCard
                  label="Horas Hasta Rotura"
                  value={result.data.hours_to_depletion || 0}
                  unit="horas"
                  status={
                    (result.data.hours_to_depletion || 0) < 4 ? 'danger' :
                    (result.data.hours_to_depletion || 0) < 8 ? 'warning' : 'success'
                  }
                />
                <MetricCard
                  label="Critical"
                  value={result.data.critical_bottleneck ? 'SÍ' : 'NO'}
                  status={result.data.critical_bottleneck ? 'danger' : 'success'}
                />
              </div>
            )}

            {result.data?.bottleneck_message && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-blue-800">Análisis de Cuello de Botella</h4>
                    <p className="text-blue-700 text-sm mt-1">{result.data.bottleneck_message}</p>
                  </div>
                </div>
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
                
                {result.llm.mitigating_actions && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Acciones Recomendadas</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {result.llm.mitigating_actions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
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
