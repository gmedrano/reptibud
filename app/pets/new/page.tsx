'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/Input/Input'
import Button from '@/components/Button/Button'
import './new-pet.css'

export default function NewPetPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, species }),
      })

      if (!response.ok) {
        throw new Error('Failed to create pet')
      }

      router.push('/pets')
      router.refresh()
    } catch (err) {
      setError('Failed to create pet. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-pet-page">
      <div className="new-pet-page__container">
        <div className="new-pet-page__header">
          <button
            onClick={() => router.back()}
            className="new-pet-page__back"
          >
            ← Back
          </button>
          <h1 className="new-pet-page__title">Add New Pet</h1>
        </div>

        <form onSubmit={handleSubmit} className="new-pet-page__form">
          {error && <div className="new-pet-page__error">{error}</div>}

          <Input
            id="name"
            name="name"
            label="Pet Name"
            value={name}
            onChange={setName}
            placeholder="e.g., Kophii"
            required
          />

          <Input
            id="species"
            name="species"
            label="Species"
            value={species}
            onChange={setSpecies}
            placeholder="e.g., Ball Python"
            required
          />

          <div className="new-pet-page__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              fullWidth
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} fullWidth>
              {loading ? 'Creating...' : 'Create Pet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
