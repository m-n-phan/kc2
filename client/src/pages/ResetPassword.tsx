import React, { useState } from 'react'
import { useResetPassword } from '../hooks/useAuth'
import { Button } from '../components'

export const ResetPassword: React.FC = () => {
  const mutation = useResetPassword()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({ email })
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-4 max-w-sm mx-auto">
      <h1 className="text-h1 text-charcoal">Reset Password</h1>
      <input
        className="w-full border p-2 rounded"
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" loading={mutation.isPending}>Reset</Button>
    </form>
  )
}
