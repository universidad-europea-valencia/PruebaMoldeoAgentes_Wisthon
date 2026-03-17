import React, { useState } from 'react'
import { Zap, Activity, AlertTriangle } from 'lucide-react'
import {
  Card,
  CardHeader,
  Button,
  ErrorMessage,
  SuccessMessage,
  LoadingSpinner,
  JSONViewer,
} from './Shared'
import { orchestratorPlanning, orchestratorReactive } from '../services/api'

export default function OrchestratorModule() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [useLLM, setUseLLM] = useState(false)
  const [mode, setMode] = useState('planning')

  const handlePlanning = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const payload = { include_llm: useLLM }
      const response = await orchestratorPlanning(payload)
      setResult(response.data)
      setMode('planning')
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReactive = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const payload = { include_llm: useLLM }
      const response = await orchestratorReactive(payload)
      setResult(response.data)
      setMode('reactive')
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
          title="Orquestador de Agentes"
          subtitle="Ejecutar workflows completos: planning y reactive"
          icon={Zap}
        />
        
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}
        {result && (
          <SuccessMessage message="Workflow ejecutado exitosamente" onDismiss={() => setResult(null)} />
        )}

        <div className="mb-6">
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={useLLM}
              onChange={(e) => setUseLLM(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600 font-medium">Incluir recomendaciones con IA en todos los agentes</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="primary"
            onClick={handlePlanning}
            disabled={loading}
          >
            {loading && mode === 'planning' ? <LoadingSpinner /> : '📋 Ejecutar Planning'}
          </Button>

          <Button
            variant="secondary"
            onClick={handleReactive}
            disabled={loading}
          >
            {loading && mode === 'reactive' ? <LoadingSpinner /> : '⚡ Ejecutar Reactive'}
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Planning:</strong> Ejecuta Fusión → Machería → Línea en secuencia para optimizar la producción.<br/>
            <strong>Reactive:</strong> Ejecuta Mantenimiento → Replanificación para responder a incidentes.
          </p>
        </div>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader
              title={mode === 'planning' ? 'Resultado de Planning' : 'Resultado de Reactive'}
              subtitle="Resumen de agentes ejecutados"
              icon={Activity}
            />
            
            {result.data && (
              <div className="space-y-4">
                {result.data.summary && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 mb-2">Resumen Ejecutivo</h4>
                    <p className="text-gray-700 text-sm">{result.data.summary}</p>
                  </div>
                )}

                {result.data.agents_executed && result.data.agents_executed.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Agentes Ejecutados</h4>
                    <div className="space-y-2">
                      {result.data.agents_executed.map((agent, idx) => (
                        <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="font-semibold text-green-800">✓ {agent}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.data.critical_issues && result.data.critical_issues.length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-semibold text-red-800">Problemas Críticos Detectados</h4>
                        <ul className="list-disc list-inside space-y-1 text-red-700 text-sm mt-2">
                          {result.data.critical_issues.map((issue, idx) => (
                            <li key={idx}>{issue}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {result.llm && (
            <Card>
              <CardHeader
                title="Análisis Consolidado con IA"
                subtitle="Perspectiva estratégica y recomendaciones globales"
              />
              
              <div className="space-y-4">
                {result.llm.executive_summary && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Resumen Ejecutivo</h4>
                    <p className="text-gray-700 leading-relaxed">{result.llm.executive_summary}</p>
                  </div>
                )}
                
                {result.llm.key_recommendations && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Recomendaciones Clave</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {result.llm.key_recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.llm.risk_assessment && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Evaluación de Riesgos</h4>
                    <p className="text-yellow-700 text-sm">{result.llm.risk_assessment}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card>
            <CardHeader title="Datos Completos en JSON" />
            <JSONViewer data={result} />
          </Card>
        </>
      )}
    </div>
  )
}
