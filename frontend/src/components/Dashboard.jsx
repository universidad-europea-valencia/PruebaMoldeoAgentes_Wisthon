import React from 'react'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Card, CardHeader, MetricCard } from './Shared'
import { Activity, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

const mockData = {
  production: [
    { hour: '00:00', target: 100, actual: 95 },
    { hour: '04:00', target: 100, actual: 98 },
    { hour: '08:00', target: 100, actual: 100 },
    { hour: '12:00', target: 100, actual: 88 },
    { hour: '16:00', target: 100, actual: 92 },
    { hour: '20:00', target: 100, actual: 99 },
  ],
  quality: [
    { type: 'Buenas', value: 920 },
    { type: 'Scrap', value: 80 },
  ],
  machines: [
    { id: 'CNC_1', status: 'operational', uptime: 99.2 },
    { id: 'CNC_2', status: 'operational', uptime: 98.5 },
    { id: 'Robot_1', status: 'operational', uptime: 99.8 },
    { id: 'Manual_1', status: 'maintenance', uptime: 95.3 },
  ]
}

const COLORS = ['#10b981', '#ef4444']

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manufacturing AI Dashboard</h1>
        <p className="text-gray-600">Sistema de Inteligencia Artificial para Manufactura Avanzada</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Tasa de Producción"
          value={94.3}
          unit="%"
          status="success"
        />
        <MetricCard
          label="Calidad (No-Scrap)"
          value={92.0}
          unit="%"
          status="success"
        />
        <MetricCard
          label="Disponibilidad de Máquinas"
          value={98.2}
          unit="%"
          status="success"
        />
        <MetricCard
          label="Órdenes En Proceso"
          value={24}
          status="normal"
        />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Estado de Machería</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">Crítico</p>
              <p className="text-xs text-red-600 mt-1">4.2 horas al colapso</p>
            </div>
            <AlertTriangle className="text-red-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Planificación</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">Actualizada</p>
              <p className="text-xs text-green-600 mt-1">Última ejecución hace 5 min</p>
            </div>
            <CheckCircle className="text-green-600" size={32} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Agentes Activos</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">6/6</p>
              <p className="text-xs text-green-600 mt-1">Todos operativos</p>
            </div>
            <Activity className="text-green-600" size={32} />
          </div>
        </Card>
      </div>

      {/* Production Chart */}
      <Card>
        <CardHeader
          title="Producción por Hora"
          subtitle="Target vs. Actual últimas 24 horas"
          icon={TrendingUp}
        />
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockData.production}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="target" fill="#3b82f6" name="Target" />
            <Bar dataKey="actual" fill="#10b981" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quality and Machines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Distribución de Calidad" subtitle="Últimas 1000 piezas" />
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockData.quality}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mockData.quality.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <CardHeader title="Estado de Máquinas" subtitle="Uptime y disponibilidad" />
          <div className="space-y-3">
            {mockData.machines.map(machine => (
              <div key={machine.id} className="border-b pb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{machine.id}</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${
                    machine.status === 'operational' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {machine.status === 'operational' ? '🟢 Operativo' : '🟡 Mantenimiento'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    style={{ width: `${machine.uptime}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-1">{machine.uptime.toFixed(1)}% uptime</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader title="Alertas Activas" subtitle="Eventos requiriendo atención" />
        <div className="space-y-3">
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <p className="font-semibold text-red-800">🔴 Stock de núcleos crítico</p>
            <p className="text-sm text-red-700 mt-1">El stock de núcleos alcanzará cero en 4.2 horas. Requiere acción inmediata.</p>
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
            <p className="font-semibold text-yellow-800">🟡 Cambio costoso detectado</p>
            <p className="text-sm text-yellow-700 mt-1">Transición Ferrítico → Perlítico tendrá costo medio. Considerar agrupación de lotes.</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
            <p className="font-semibold text-blue-800">ℹ️ Replanificación completada</p>
            <p className="text-sm text-blue-700 mt-1">Última ejecución de planning: hace 5 minutos. 2 rutas optimizadas.</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
