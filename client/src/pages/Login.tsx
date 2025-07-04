import React, { useState } from 'react'
import { useLogin } from '../hooks/useAuth'
import { Button } from '../components'

export const Login: React.FC = () => {
  const mutation = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-4 max-w-sm mx-auto">
      <h1 className="text-h1 text-charcoal">Login</h1>
      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" loading={mutation.isPending}>Login</Button>
    </form>
  )
}
