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
  const [editingLogId, setEditingLogId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

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

  const handleDeleteLog = async (logId: string) => {
    if (!confirm('Are you sure you want to delete this log entry?')) {
      return
    }

    try {
      const response = await fetch(`/api/pets/${pet.id}/logs/${logId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const updatedPet = await response.json()
        setPet(updatedPet)
      }
    } catch (error) {
      console.error('Failed to delete log')
    }
  }

  const handleEditLog = (logId: string, currentContent: string) => {
    setEditingLogId(logId)
    setEditContent(currentContent)
  }

  const handleSaveEdit = async (logId: string) => {
    if (!editContent.trim()) return

    try {
      const response = await fetch(`/api/pets/${pet.id}/logs/${logId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      })

      if (response.ok) {
        const updatedPet = await response.json()
        setPet(updatedPet)
        setEditingLogId(null)
        setEditContent('')
      }
    } catch (error) {
      console.error('Failed to update log')
    }
  }

  const handleCancelEdit = () => {
    setEditingLogId(null)
    setEditContent('')
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
    const month = date.toLocaleString('en-US', { month: 'short' })
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    
    return `${month} ${day} at ${displayHours}:${minutes} ${ampm}`
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
          {showLogForm ? 'Cancel' : 'Add Journal Entry'}
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
                  <div className="timeline-item__header-left">
                    <span className={`timeline-item__type timeline-item__type--${log.type}`}>
                      {log.type}
                    </span>
                    <span className="timeline-item__date">{formatDate(log.timestamp)}</span>
                  </div>
                  <div className="timeline-item__actions">
                    <button
                      onClick={() => handleEditLog(log.id, log.content)}
                      className="timeline-item__action-button timeline-item__action-button--edit"
                      aria-label="Edit log"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="timeline-item__action-button timeline-item__action-button--delete"
                      aria-label="Delete log"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </div>
                {editingLogId === log.id ? (
                  <div className="timeline-item__edit-form">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="timeline-item__edit-textarea"
                      rows={3}
                    />
                    <div className="timeline-item__edit-actions">
                      <button
                        onClick={() => handleSaveEdit(log.id)}
                        className="timeline-item__edit-button timeline-item__edit-button--save"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="timeline-item__edit-button timeline-item__edit-button--cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="timeline-item__content">{log.content}</p>
                )}
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
