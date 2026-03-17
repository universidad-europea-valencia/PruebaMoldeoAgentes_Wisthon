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
import { fusionPlan } from '../services/api'

const mockOrders = [
  { id: 1, material: 'Ferrítico', quantity: 100 },
  { id: 2, material: 'Perlítico', quantity: 150 },
  { id: 3, material: 'Ferrítico', quantity: 80 },
]

export default function FusionModule() {
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
      
      const response = await fusionPlan(payload)
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
          title="Agente de Fusión"
          subtitle="Optimización de secuencia de metales y minimización de costos de transición"
        />
        
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}
        {result && (
          <SuccessMessage message="Plan de fusión generado exitosamente" onDismiss={() => setResult(null)} />
        )}

        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Órdenes de Producción</h4>
          <div className="space-y-2 mb-4">
            {orders.map((order, idx) => (
              <div key={idx} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">Orden #{order.id}</p>
                  <p className="text-sm text-gray-600">{order.material} - {order.quantity} piezas</p>
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
            <span className="text-sm text-gray-600 font-medium">Usar LLM para explicación y riesgos</span>
          </label>
        </div>

        <Button variant="primary" onClick={handlePlan} disabled={loading}>
          {loading ? <LoadingSpinner /> : '🔨 Generar Plan de Fusión'}
        </Button>
      </Card>

      {result && (
        <>
          <Card>
            <CardHeader
              title="Plan de Fusión Optimizado"
              subtitle="Secuencia y costos de transición"
            />
            
            {result.data && (
              <div className="space-y-4">
                {result.data.optimized_sequence && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Secuencia Optimizada</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {result.data.optimized_sequence.map((material, idx) => (
                        <React.Fragment key={idx}>
                          <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold text-sm">
                            {material}
                          </div>
                          {idx < result.data.optimized_sequence.length - 1 && (
                            <span className="text-blue-600 font-bold">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}

                {result.data.total_transition_cost !== undefined && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <MetricCard
                      label="Costo Total de Transición"
                      value={result.data.total_transition_cost.toFixed(2)}
                      status="normal"
                    />
                    <MetricCard
                      label="Transiciones Optimizadas"
                      value={result.data.transitions_count || 0}
                      status="success"
                    />
                    {result.data.metalurgic_risk && (
                      <MetricCard
                        label="Riesgo Metalúrgico"
                        value={result.data.metalurgic_risk}
                        status="warning"
                      />
                    )}
                  </div>
                )}

                {result.data.metallurgic_notes && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <h4 className="font-semibold text-yellow-800">Consideraciones Metalúrgicas</h4>
                        <p className="text-yellow-700 text-sm mt-1">{result.data.metallurgic_notes}</p>
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
                subtitle="Explicación y análisis de riesgos"
              />
              
              <div className="space-y-4">
                {result.llm.reasoning && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Análisis</h4>
                    <p className="text-gray-700 leading-relaxed">{result.llm.reasoning}</p>
                  </div>
                )}
                
                {result.llm.metallurgic_risks && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Riesgos Metalúrgicos Identificados</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {result.llm.metallurgic_risks.map((risk, idx) => (
                        <li key={idx}>{risk}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.llm.supervisor_recommendation && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-green-800 text-sm"><strong>Recomendación:</strong> {result.llm.supervisor_recommendation}</p>
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
