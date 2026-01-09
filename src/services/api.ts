import axios from 'axios'
import type { OAuthProvider } from '../types/oauth'

/**
 * Get token value from cookie by name
 */
const getCookieValue = (name: string): string | null => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

/**
 * Get satoken from cookie
 */
const getSatoken = (): string | null => {
  return getCookieValue('Authorization')
}

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for session cookies
})

// Add request interceptor to automatically add Bearer token
api.interceptors.request.use((config) => {
  const token = getSatoken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export { api }

export const oauthApi = {
  /**
   * Get authorization URL for OAuth provider
   */
  async getAuthorizationUrl(provider: OAuthProvider, redirectUrl?: string): Promise<string> {
    const response = await api.get<string>(`/oauth/authorize/${provider}`, {
      params: {
        redirectUrl: redirectUrl || window.location.origin
      }
    })
    return response.data;
  }
}


