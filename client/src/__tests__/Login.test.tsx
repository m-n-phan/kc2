import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Login } from '../pages/Login'

const mockMutate = vi.fn()
vi.mock('../hooks/useAuth', () => ({
  useLogin: () => ({ mutate: mockMutate, isPending: false })
}))

describe('Login page', () => {
  it('submits credentials', () => {
    render(<Login />)
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'pass' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    expect(mockMutate).toHaveBeenCalledWith({ email: 'a@b.com', password: 'pass' })
  })
})
