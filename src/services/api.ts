import axios from 'axios'
import type { OAuthProvider, AuthorizationUrlResponse, OAuthCallbackResponse } from '../types/oauth'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export const oauthApi = {
  /**
   * Get authorization URL for OAuth provider
   */
  async getAuthorizationUrl(provider: OAuthProvider, redirectUrl?: string): Promise<string> {
    const response = await api.get<AuthorizationUrlResponse>(`/oauth/authorize/${provider}`, {
      params: {
        redirectUrl: redirectUrl || window.location.origin
      }
    })
    return response.data.authorizationUrl
  },

  /**
   * Handle OAuth callback
   */
  async handleCallback(
    provider: OAuthProvider,
    params: URLSearchParams
  ): Promise<OAuthCallbackResponse> {
    const queryParams: Record<string, string> = {}
    params.forEach((value, key) => {
      queryParams[key] = value
    })
    
    const response = await api.get<OAuthCallbackResponse>(`/oauth/callback/${provider}`, {
      params: queryParams
    })
    return response.data
  }
}


