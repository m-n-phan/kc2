import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import twilio from 'twilio'
import crypto from 'node:crypto'
import { db, users } from '../db'
import type { AuthService, AuthTokens } from './AuthService'
import { requireEnv } from '../utils/requireEnv'

const JWT_SECRET = requireEnv('JWT_SECRET')

const mailTransport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: false,
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    : undefined
})

const twilioClient =
  process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN)
    : null

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

  private async sendEmail(to: string, subject: string, text: string) {
    if (!process.env.SMTP_HOST) return
    await mailTransport.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text
    })
  }

  private async sendSms(message: string) {
    const to = process.env.TWILIO_TO_NUMBER
    if (!twilioClient || !to || !process.env.TWILIO_FROM_NUMBER) return
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_FROM_NUMBER,
      to
    })
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

  async register(name: string, email: string, password: string): Promise<AuthTokens | null> {
    const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
    if (existing[0]) return null
    const passwordHash = await bcrypt.hash(password, 10)
    const [newUser] = await db
      .insert(users)
      .values({ name, email, passwordHash, role: 'Staff' })
      .returning()
    await this.sendEmail(email, 'Welcome to KitchenCoach', 'Your account has been created.')
    await this.sendSms(`New user registered: ${email}`)
    return this.issueTokens(newUser as unknown as { id: string; role: string })
  }

  async resetPassword(email: string): Promise<void> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
    const user = result[0] as unknown as { id: string } | undefined
    if (!user) return
    const newPass = crypto.randomBytes(4).toString('hex')
    const hash = await bcrypt.hash(newPass, 10)
    await db.update(users).set({ passwordHash: hash, updatedAt: new Date() }).where(eq(users.id, user.id))
    const msg = `Your temporary password is ${newPass}`
    await this.sendEmail(email, 'Password Reset', msg)
    await this.sendSms(`Password reset for ${email}: ${newPass}`)
  }
}
