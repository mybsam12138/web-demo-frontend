export type OAuthProvider = 'OAUTH_GOOGLE' | 'OAUTH_TWITTER' | 'OAUTH_GITHUB' | 'OAUTH_GITEE'

export interface OAuthUser {
  uuid: string
  username: string
  nickname: string
  avatar: string
  email: string
}


