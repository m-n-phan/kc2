import { useMutation } from '@tanstack/react-query'
import { setAuthTokens } from '../utils/auth'

import { authClient } from '../lib/auth-client'

const handle = async (url: string, body: unknown) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export function useRegister() {
  return useMutation((data: { name: string; email: string; password: string }) =>
    authClient.signUp.email(data)
  )
}

export function useLogin() {
  return useMutation(async (data: { email: string; password: string }) => {
    const result = await handle('/auth/login', data)
    if (result?.data?.accessToken && result?.data?.refreshToken) {
      setAuthTokens(result.data.accessToken, result.data.refreshToken)
    }
    return result
  })
}

export function useResetPassword() {
  return useMutation((data: { email: string }) => handle('/auth/reset-password', data))
}

export function useLogin() {
  return useMutation((data: { email: string; password: string }) =>
    authClient.signIn.email(data)
  )
}
