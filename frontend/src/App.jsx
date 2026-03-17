import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Dashboard from './components/Dashboard'
import Fusion from './components/Fusion'
import Macheria from './components/Macheria'
import Linea from './components/Linea'
import Calidad from './components/Calidad'
import Mantenimiento from './components/Mantenimiento'
import Orchestrator from './components/Orchestrator'
import './App.css'

const PAGES = [
  { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
  { id: 'orchestrator', label: '⚡ Orquestador', icon: '⚡' },
  { id: 'fusion', label: '🔨 Fusión', icon: '🔨' },
  { id: 'macheria', label: '⚙️ Machería', icon: '⚙️' },
  { id: 'linea', label: '📈 Línea', icon: '📈' },
  { id: 'calidad', label: '✓ Calidad', icon: '✓' },
  { id: 'mantenimiento', label: '🔧 Mantenimiento', icon: '🔧' },
]

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'fusion':
        return <Fusion />
      case 'macheria':
        return <Macheria />
      case 'linea':
        return <Linea />
      case 'calidad':
        return <Calidad />
      case 'mantenimiento':
        return <Mantenimiento />
      case 'orchestrator':
        return <Orchestrator />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 text-white transition-all duration-300 flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold">Manufacturing AI</h1>
          <p className="text-xs text-gray-400 mt-1">Sistema de Inteligencia Industrial</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {PAGES.map(page => (
            <button
              key={page.id}
              onClick={() => setCurrentPage(page.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                currentPage === page.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-lg mr-2">{page.icon}</span>
              {page.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 text-xs text-gray-400">
          <p>🟢 Conectado a API</p>
          <p className="mt-1">http://localhost:8001</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {PAGES.find(p => p.id === currentPage)?.label}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            API Conectada
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

export default App
