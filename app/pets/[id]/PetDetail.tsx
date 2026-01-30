'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pet, LogType } from '@/lib/types'
import Button from '@/components/Button/Button'
import Textarea from '@/components/Textarea/Textarea'
import EmptyState from '@/components/EmptyState/EmptyState'
import './pet-detail.css'

interface PetDetailProps {
  pet: Pet
}

export default function PetDetail({ pet: initialPet }: PetDetailProps) {
  const router = useRouter()
  const [pet, setPet] = useState(initialPet)
  const [showLogForm, setShowLogForm] = useState(false)
  const [logType, setLogType] = useState<LogType>('feeding')
  const [logContent, setLogContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleQuickFeed = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/pets/${pet.id}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'feeding',
          content: 'Fed',
        }),
      })

      if (response.ok) {
        const updatedPet = await response.json()
        setPet(updatedPet)
      }
    } catch (error) {
      console.error('Failed to log feeding')
    } finally {
      setLoading(false)
    }
  }

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/pets/${pet.id}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: logType,
          content: logContent,
        }),
      })

      if (response.ok) {
        const updatedPet = await response.json()
        setPet(updatedPet)
        setLogContent('')
        setShowLogForm(false)
      }
    } catch (error) {
      console.error('Failed to add log')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${pet.name}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/pets/${pet.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/pets')
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to delete pet')
    }
  }

  const formatDate = (isoString: string) => {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="pet-detail">
      <div className="pet-detail__header">
        <button onClick={() => router.push('/pets')} className="pet-detail__back">
          ← Back
        </button>
      </div>

      <div className="pet-detail__info">
        {pet.photoUrl && (
          <img src={pet.photoUrl} alt={pet.name} className="pet-detail__image" />
        )}
        <h1 className="pet-detail__name">{pet.name}</h1>
        <p className="pet-detail__species">{pet.species}</p>
      </div>

      <div className="pet-detail__actions">
        <Button onClick={handleQuickFeed} disabled={loading} fullWidth>
          Quick Feed
        </Button>
        <Button
          onClick={() => setShowLogForm(!showLogForm)}
          variant="secondary"
          fullWidth
        >
          {showLogForm ? 'Cancel' : 'Add Log'}
        </Button>
      </div>

      {showLogForm && (
        <form onSubmit={handleAddLog} className="pet-detail__log-form">
          <div className="pet-detail__log-type">
            <label className="pet-detail__log-type-label">Log Type</label>
            <div className="pet-detail__log-type-options">
              {(['feeding', 'shedding', 'note'] as LogType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setLogType(type)}
                  className={`pet-detail__log-type-button ${
                    logType === type ? 'pet-detail__log-type-button--active' : ''
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            id="logContent"
            name="logContent"
            label="Details"
            value={logContent}
            onChange={setLogContent}
            placeholder="Add details about this log entry..."
            required
            rows={3}
          />

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Adding...' : 'Add Log Entry'}
          </Button>
        </form>
      )}

      <div className="pet-detail__timeline">
        <h2 className="pet-detail__timeline-title">Timeline</h2>
        {pet.logs.length === 0 ? (
          <EmptyState
            title="No logs yet"
            message="Start tracking care by adding your first log entry"
          />
        ) : (
          <div className="pet-detail__timeline-list">
            {pet.logs.map((log) => (
              <div key={log.id} className="timeline-item">
                <div className="timeline-item__header">
                  <span className={`timeline-item__type timeline-item__type--${log.type}`}>
                    {log.type}
                  </span>
                  <span className="timeline-item__date">{formatDate(log.timestamp)}</span>
                </div>
                <p className="timeline-item__content">{log.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pet-detail__danger-zone">
        <h3 className="pet-detail__danger-title">Danger Zone</h3>
        <Button onClick={handleDelete} variant="danger" fullWidth>
          Delete Pet
        </Button>
      </div>
    </div>
  )
}
