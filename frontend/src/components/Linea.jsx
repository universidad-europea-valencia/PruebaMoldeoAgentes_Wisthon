import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import {
  Card,
  CardHeader,
  MetricCard,
  Button,
  ErrorMessage,
  SuccessMessage,
  LoadingSpinner,
  JSONViewer,
} from './Shared'
import { lineaPlan } from '../services/api'

const mockOrders = [
  { id: 1, model: 'ModeloA', quantity: 100, cycle_time_minutes: 5 },
  { id: 2, model: 'ModeloB', quantity: 150, cycle_time_minutes: 8 },
  { id: 3, model: 'ModeloA', quantity: 80, cycle_time_minutes: 5 },
]

export default function LineaModule() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [useLLM, setUseLLM] = useState(false)
  const [orders, setOrders] = useState(mockOrders)

  const handlePlan = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const payload = {
        ordenes_produccion: orders,
        include_llm: useLLM
      }
      
      const response = await lineaPlan(payload)
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
          title="Agente de Línea"
          subtitle="Planificación de tiempos y secuenciación de modelos"
        />
        
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}
        {result && (
          <SuccessMessage message="Plan de línea generado exitosamente" onDismiss={() => setResult(null)} />
        )}

        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Órdenes para Línea</h4>
          <div className="space-y-2 mb-4">
            {orders.map((order, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">Orden #{order.id}</p>
                  <p className="text-sm text-gray-600">{order.model} - {order.quantity} piezas - {order.cycle_time_minutes}min/ciclo</p>
                </div>
              </div>
            ))}
          </div>

          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={useLLM}
              onChange={(e) => setUseLLM(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600 font-medium">Usar LLM para análisis de cambios costosos</span>
          </label>
        </div>

        <Button variant="primary" onClick={handlePlan} disabled={loading}>
          {loading ? <LoadingSpinner /> : '⏱️ Generar Plan de Línea'}
        </Button>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader
              title="Plan de Línea"
              subtitle="Secuenciación y tiempos de producción"
            />
            
            {result.data && (
              <div className="space-y-4">
                {result.data.line_available !== undefined && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                      label="Línea Disponible"
                      value={result.data.line_available ? '✓ SÍ' : '✗ NO'}
                      status={result.data.line_available ? 'success' : 'danger'}
                    />
                    <MetricCard
                      label="Carga Total (horas)"
                      value={(result.data.total_load_hours || 0).toFixed(2)}
                      unit="h"
                      status="normal"
                    />
                    {result.data.expensive_changeovers_count !== undefined && (
                      <MetricCard
                        label="Cambios Costosos"
                        value={result.data.expensive_changeovers_count}
                        status={result.data.expensive_changeovers_count > 0 ? 'warning' : 'success'}
                      />
                    )}
                  </div>
                )}

                {result.data.sequence && result.data.sequence.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-3">Secuencia Planificada</h4>
                    <div className="space-y-2">
                      {result.data.sequence.map((item, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border border-blue-200">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold text-gray-800">Paso {idx + 1}: {item.model}</p>
                              <p className="text-sm text-gray-600">{item.quantity} piezas × {item.cycle_time_minutes}min</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-blue-600">{item.total_time_minutes} min</p>
                              {item.changeover_type && (
                                <p className={`text-xs ${item.changeover_type === 'expensive' ? 'text-red-600' : 'text-green-600'}`}>
                                  Cambio: {item.changeover_type}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.data.grouping_suggestion && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Sugerencia de Agrupación</h4>
                        <p className="text-yellow-700 text-sm mt-1">{result.data.grouping_suggestion}</p>
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
                title="Recomendaciones con IA"
                subtitle="Análisis de secuencia y optimizaciones"
              />
              
              <div className="space-y-4">
                {result.llm.reasoning && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Análisis</h4>
                    <p className="text-gray-700 leading-relaxed">{result.llm.reasoning}</p>
                  </div>
                )}
                
                {result.llm.expensive_changeovers && result.llm.expensive_changeovers.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Cambios Costosos Detectados</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {result.llm.expensive_changeovers.map((change, idx) => (
                        <li key={idx}>{change}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.llm.grouping_proposal && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm"><strong>Propuesta de Agrupación:</strong> {result.llm.grouping_proposal}</p>
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
