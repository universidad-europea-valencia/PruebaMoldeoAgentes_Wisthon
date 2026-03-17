import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
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
import { calidadReplenish } from '../services/api'

export default function CalidadModule() {
  const [formData, setFormData] = useState({
    target_quantity: 500,
    scrap_rate: 0.08,
  })
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [useLLM, setUseLLM] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'scrap_rate' ? parseFloat(value) / 100 : parseFloat(value) || value
    }))
  }

  const handleReplenish = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const payload = {
        ...formData,
        include_llm: useLLM
      }
      
      const response = await calidadReplenish(payload)
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
          title="Cálculo de Reabastecimiento por Calidad"
          subtitle="Determinar cantidad adicional necesaria para compensar scrap"
        />
        
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}
        {result && (
          <SuccessMessage message="Cálculo completado exitosamente" onDismiss={() => setResult(null)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <FormGroup label="Cantidad objetivo (piezas)" required>
            <Input
              type="number"
              name="target_quantity"
              value={formData.target_quantity}
              onChange={handleChange}
              min="0"
            />
          </FormGroup>

          <FormGroup label="Tasa de rechazo/scrap (%)" required>
            <Input
              type="number"
              name="scrap_rate"
              value={(formData.scrap_rate * 100).toFixed(2)}
              onChange={handleChange}
              min="0"
              max="100"
              step="0.1"
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
          <Button variant="primary" onClick={handleReplenish} disabled={loading}>
            {loading ? <LoadingSpinner /> : 'Calcular Reabastecimiento'}
          </Button>
        </div>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader
              title="Resultados del Cálculo"
              subtitle="Piezas adicionales requeridas"
            />
            
            {result.data && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  label="Cantidad Objetivo"
                  value={result.data.N_target || 0}
                  status="normal"
                />
                <MetricCard
                  label="Tasa de Scrap"
                  value={(result.data.R_scrap * 100).toFixed(2)}
                  unit="%"
                  status="warning"
                />
                <MetricCard
                  label="Piezas Adicionales"
                  value={result.data.extra_pieces || 0}
                  status={result.data.extra_pieces > 50 ? 'warning' : 'normal'}
                />
                <MetricCard
                  label="Nueva Cantidad Total"
                  value={result.data.N_new || 0}
                  status="success"
                />
              </div>
            )}

            {result.data?.impact_message && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <h4 className="font-semibold text-orange-800">Impacto de Calidad</h4>
                    <p className="text-orange-700 text-sm mt-1">{result.data.impact_message}</p>
                  </div>
                </div>
              </div>
            )}

            {result.data?.formula && (
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                <p className="text-gray-600 mb-2">Fórmula aplicada:</p>
                <p className="text-gray-900">{result.data.formula}</p>
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
                
                {result.llm.recommended_action && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Acción Recomendada</h4>
                    <p className="text-gray-700">{result.llm.recommended_action}</p>
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
