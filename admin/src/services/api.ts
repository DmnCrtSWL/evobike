const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
// Limpiar diagonal al final si existe
export const API_URL = rawApiUrl.replace(/\/$/, '')

const rawClientUrl = import.meta.env.VITE_CLIENT_URL || 'http://localhost:5174'
export const CLIENT_URL = rawClientUrl.replace(/\/$/, '')
