import axios from 'axios'
import type { OAuthProvider, UserVo } from '../types/oauth'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for session cookies
})

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
  },

  /**
   * Get current user information
   */
  async getUserInfo(): Promise<UserVo> {
    const response = await api.get<UserVo>('/user/info')
    return response.data
  }
}


