export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthService {
  login(email: string, password: string): Promise<AuthTokens | null>
  refresh(refreshToken: string): Promise<AuthTokens | null>
  register(name: string, email: string, password: string): Promise<AuthTokens | null>
  resetPassword(email: string): Promise<void>
}
