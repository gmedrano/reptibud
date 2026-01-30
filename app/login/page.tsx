'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import './login.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else if (data.session) {
        window.location.href = '/pets'
      }
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h1 className="auth-page__title">ReptiBud</h1>
        <p className="auth-page__subtitle">Sign in to your account</p>

        <form onSubmit={handleLogin} className="auth-page__form">
          {error && <div className="auth-page__error">{error}</div>}

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="your@email.com"
            required
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
          />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="auth-page__link">
          Don't have an account?{' '}
          <a href="/signup" className="auth-page__link-text">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
