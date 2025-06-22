import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db, users } from '../db'
import type { AuthService, AuthTokens } from './AuthService'
import { requireEnv } from '../utils/requireEnv'

const JWT_SECRET = requireEnv('JWT_SECRET')

export class DbAuthService implements AuthService {
  private issueTokens(user: { id: string; role: string }): AuthTokens {
    const accessToken = jwt.sign(
      { role: user.role },
      JWT_SECRET,
      { subject: user.id, expiresIn: '15m' }
    )
    const refreshToken = jwt.sign(
      { role: user.role, type: 'refresh' },
      JWT_SECRET,
      { subject: user.id, expiresIn: '7d' }
    )
    return { accessToken, refreshToken }
  }

  async login(email: string, password: string): Promise<AuthTokens | null> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    const user = result[0] as unknown as { id: string; passwordHash: string; role: string } | undefined
    if (!user) return null

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return null

    return this.issueTokens(user)
  }

  async refresh(refreshToken: string): Promise<AuthTokens | null> {
    try {
      const payload = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload
      if (payload.type !== 'refresh') return null
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, payload.sub as string))
        .limit(1)
      const user = result[0] as unknown as { id: string; role: string } | undefined
      if (!user) return null
      return this.issueTokens(user)
    } catch {
      return null
    }
  }
}
