'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import '../login/login.css'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
      } else if (data.session) {
        window.location.href = '/pets'
      } else {
        setError('Please check your email to confirm your account')
        setLoading(false)
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
        <p className="auth-page__subtitle">Create your account</p>

        <form onSubmit={handleSignup} className="auth-page__form">
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

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="••••••••"
            required
          />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="auth-page__link">
          Already have an account?{' '}
          <a href="/login" className="auth-page__link-text">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
