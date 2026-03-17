import React from 'react'
import { AlertCircle, CheckCircle, Zap } from 'lucide-react'

export const Card = ({ children, className = '' }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
)

export const CardHeader = ({ title, subtitle, icon: Icon }) => (
  <div className="card-header">
    <div className="flex items-center gap-3">
      {Icon && <Icon size={24} className="text-blue-600" />}
      <div>
        <h3 className="card-title">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      </div>
    </div>
  </div>
)

export const MetricCard = ({ label, value, unit = '', trend, status = 'normal' }) => {
  const statusColor = {
    success: 'text-green-600 bg-green-50',
    warning: 'text-yellow-600 bg-yellow-50',
    danger: 'text-red-600 bg-red-50',
    normal: 'text-gray-600 bg-gray-50',
  }[status]

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <p className="text-sm text-gray-600 font-medium">{label}</p>
      <div className={`flex items-baseline gap-2 mt-2 ${statusColor} p-3 rounded-lg`}>
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-sm font-semibold">{unit}</span>}
        {trend && <span className="text-xs ml-auto">{trend}</span>}
      </div>
    </div>
  )
}

export const StatusBadge = ({ status, label }) => {
  const styles = {
    operational: 'badge badge-success',
    warning: 'badge badge-warning',
    error: 'badge badge-danger',
    info: 'badge badge-info',
  }

  return <span className={styles[status] || styles.info}>{label}</span>
}

export const LoadingSpinner = ({ size = 'md' }) => (
  <div className="flex justify-center items-center p-4">
    <Zap className={`spinner text-blue-600 ${size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'}`} />
  </div>
)

export const ErrorMessage = ({ message, onDismiss }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-4">
    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
    <div className="flex-1">
      <h3 className="font-semibold text-red-800">Error</h3>
      <p className="text-sm text-red-700 mt-1">{message}</p>
    </div>
    {onDismiss && (
      <button onClick={onDismiss} className="text-red-600 hover:text-red-800 font-bold">
        ✕
      </button>
    )}
  </div>
)

export const SuccessMessage = ({ message, onDismiss }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mb-4">
    <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
    <div className="flex-1">
      <h3 className="font-semibold text-green-800">Éxito</h3>
      <p className="text-sm text-green-700 mt-1">{message}</p>
    </div>
    {onDismiss && (
      <button onClick={onDismiss} className="text-green-600 hover:text-green-800 font-bold">
        ✕
      </button>
    )}
  </div>
)

export const FormGroup = ({ label, error, required = false, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
      {required && <span className="text-red-600 ml-1">*</span>}
    </label>
    {children}
    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
  </div>
)

export const Input = ({ error, ...props }) => (
  <input
    {...props}
    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? 'border-red-500' : 'border-gray-300'
    }`}
  />
)

export const Select = ({ options, error, ...props }) => (
  <select
    {...props}
    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? 'border-red-500' : 'border-gray-300'
    }`}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
)

export const Button = ({ variant = 'primary', children, ...props }) => (
  <button className={`btn btn-${variant}`} {...props}>
    {children}
  </button>
)

export const JSONViewer = ({ data }) => (
  <div className="bg-gray-900 rounded-lg p-4 text-gray-100 font-mono text-sm overflow-x-auto max-h-96">
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
)
