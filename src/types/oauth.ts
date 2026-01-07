export type OAuthProvider = 'OAUTH_GOOGLE' | 'OAUTH_TWITTER'

export interface OAuthUser {
  uuid: string
  username: string
  nickname: string
  avatar: string
  email: string
}

export interface OAuthCallbackResponse {
  success: boolean
  user?: OAuthUser
  redirectUrl?: string
  error?: string
}

export interface AuthorizationUrlResponse {
  authorizationUrl: string
}

