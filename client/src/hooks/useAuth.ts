import { useMutation } from '@tanstack/react-query'

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


export function useResetPassword() {
  return useMutation((data: { email: string }) => handle('/auth/reset-password', data))
}

export function useLogin() {
  return useMutation((data: { email: string; password: string }) =>
    authClient.signIn.email(data)
  )
}
