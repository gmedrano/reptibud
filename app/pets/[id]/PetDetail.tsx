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
          <svg width="100pt" height="100pt" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
          <path d="m81.395 36.57c-1.5664-1.2695-3.3633-2.2734-5.207-3.0938-5.7227-2.5508-12.059-3.5234-18.324-3.4805-6.3555 0.042968-12.879 0.95703-19.035 2.5156-3.6758 0.93359-7.332 1.9727-10.945 3.125-3.5977 1.1445-7.2227 2.1289-10.652 3.75-1.6016 0.75781-3.1875 1.6602-4.3438 3.0078-1.5 1.7461-1.5312 4.7031 0.76172 5.8633 1.2461 0.62891 2.7227 0.46484 4.1133 0.34375 1.125-0.10156 2.2539-0.16406 3.3828-0.19141 1.5391-0.039062 3.082-0.015625 4.6172 0.0625 3.4531 0.17578 6.9336 0.63672 10.16 1.8867 2.8438 1.1016 5.418 2.7891 7.8281 4.6406 2.4414 1.875 4.8555 4.3984 7.8711 5.2969 3.2422 0.96875 6.6953 0.91797 10.027 0.5 0.73828-0.09375 1.4766-0.20312 2.2109-0.32812 4.6602-0.78906 9.2617-2.0625 13.531-4.0938 1.9492-0.92578 3.8398-2.0234 5.4141-3.5 1.5703-1.4766 2.8125-3.3672 3.2461-5.4844 0.61719-3.0117-0.48047-6.207-2.418-8.5938-0.67187-0.82812-1.4219-1.5625-2.2383-2.2266zm-11.82 15.008c-5.0781 1.5781-10.016 0.22656-11.023-3.0156-1.0078-3.2461 2.293-7.1523 7.3711-8.7305s10.016-0.22656 11.023 3.0156c1.0117 3.2422-2.2891 7.1523-7.3711 8.7305z"/>
          <path d="m94.504 45.734c-0.13281-0.98047-0.31641-1.957-0.55859-2.918-0.48828-1.9453-1.2148-3.832-2.2188-5.5664-4.3828-7.5547-13.336-11.703-21.555-13.461-2.4883-0.53125-5.0156-0.86719-7.5547-1.0273-7.4648-0.46875-15.07 0.4375-22.355 2.0625-8.9414 1.9922-17.559 5.2969-25.723 9.4297-2.543 1.2852-5.1133 2.7109-6.9023 4.9258-2.2695 2.8164-3.0078 6.6133-2.8477 10.227 0.20313 4.6523 2.0078 9.0703 6.9375 10.133 2.2383 0.48438 4.5586 0.375 6.8242 0.6875 3.332 0.46094 6.4883 1.8359 9.3555 3.5977 2.3359 1.4336 4.5039 3.125 6.6289 4.8516 1.9961 1.6211 4.3125 3.0547 6.6133 4.2266 9.2891 4.7344 20.438 3.8203 30.586 1.4375 5.2383-1.2305 10.578-2.8984 14.926-6.1836 6.7266-5.0859 8.9297-14.395 7.8438-22.422zm-4.8281 6.4727c-0.72266 1.1875-1.668 2.2617-2.8828 3.2812-7.0078 5.8906-16.16 8.4453-25.078 9.5938-0.6875 0.089844-1.3789 0.16406-2.0703 0.21875-4.8398 0.39453-9.8867-0.14453-14.156-2.4648-3.5-1.9062-6.2891-4.8945-9.6719-7.0078-2.5664-1.6016-5.4453-2.6719-8.4102-3.2578-3.9062-0.77734-8.1094-0.79687-12.09-0.80859-1.0898-0.003907-2.1875 0.007812-3.2617-0.19141-1.0703-0.20312-2.1289-0.63672-2.8945-1.4141-1.1055-1.125-1.4414-2.8242-1.2969-4.3945 0.22656-2.4961 1.6172-4.8438 3.6406-6.3125 1.0859-0.78906 2.3438-1.4297 3.5156-2.0898 1.3789-0.77344 2.7852-1.4922 4.2188-2.1641 3.1133-1.4609 6.3203-2.707 9.5703-3.832 4.8477-1.6797 9.8203-2.9922 14.848-4.0039 9.1211-1.8398 18.773-2.7148 27.852-0.19141 6.2383 1.7305 12.262 5.0977 16.391 10.16 2.2188 2.7148 3.4766 5.3633 3.6406 7.6602 0.23438 3.2461-1.0664 5.918-1.8633 7.2188z"/>
          </svg>
          <span>Quick Feed</span>
        </Button>
        <Button
          onClick={() => setShowLogForm(!showLogForm)}
          variant="secondary"
          fullWidth
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>{showLogForm ? 'Cancel' : 'Add Journal Entry'}</span>
        </Button>
      </div>

      {showLogForm && (
        <form onSubmit={handleAddLog} className="pet-detail__log-form">
          <div className="pet-detail__log-type">
            <label className="pet-detail__log-type-label">Log Type</label>
            <div className="pet-detail__log-type-options">
              <button
                type="button"
                onClick={() => setLogType('feeding')}
                className={`pet-detail__log-type-button ${
                  logType === 'feeding' ? 'pet-detail__log-type-button--active' : ''
                }`}
              >
                <svg width="100pt" height="100pt" version="1.1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="m81.395 36.57c-1.5664-1.2695-3.3633-2.2734-5.207-3.0938-5.7227-2.5508-12.059-3.5234-18.324-3.4805-6.3555 0.042968-12.879 0.95703-19.035 2.5156-3.6758 0.93359-7.332 1.9727-10.945 3.125-3.5977 1.1445-7.2227 2.1289-10.652 3.75-1.6016 0.75781-3.1875 1.6602-4.3438 3.0078-1.5 1.7461-1.5312 4.7031 0.76172 5.8633 1.2461 0.62891 2.7227 0.46484 4.1133 0.34375 1.125-0.10156 2.2539-0.16406 3.3828-0.19141 1.5391-0.039062 3.082-0.015625 4.6172 0.0625 3.4531 0.17578 6.9336 0.63672 10.16 1.8867 2.8438 1.1016 5.418 2.7891 7.8281 4.6406 2.4414 1.875 4.8555 4.3984 7.8711 5.2969 3.2422 0.96875 6.6953 0.91797 10.027 0.5 0.73828-0.09375 1.4766-0.20312 2.2109-0.32812 4.6602-0.78906 9.2617-2.0625 13.531-4.0938 1.9492-0.92578 3.8398-2.0234 5.4141-3.5 1.5703-1.4766 2.8125-3.3672 3.2461-5.4844 0.61719-3.0117-0.48047-6.207-2.418-8.5938-0.67187-0.82812-1.4219-1.5625-2.2383-2.2266zm-11.82 15.008c-5.0781 1.5781-10.016 0.22656-11.023-3.0156-1.0078-3.2461 2.293-7.1523 7.3711-8.7305s10.016-0.22656 11.023 3.0156c1.0117 3.2422-2.2891 7.1523-7.3711 8.7305z"/>
                  <path d="m94.504 45.734c-0.13281-0.98047-0.31641-1.957-0.55859-2.918-0.48828-1.9453-1.2148-3.832-2.2188-5.5664-4.3828-7.5547-13.336-11.703-21.555-13.461-2.4883-0.53125-5.0156-0.86719-7.5547-1.0273-7.4648-0.46875-15.07 0.4375-22.355 2.0625-8.9414 1.9922-17.559 5.2969-25.723 9.4297-2.543 1.2852-5.1133 2.7109-6.9023 4.9258-2.2695 2.8164-3.0078 6.6133-2.8477 10.227 0.20313 4.6523 2.0078 9.0703 6.9375 10.133 2.2383 0.48438 4.5586 0.375 6.8242 0.6875 3.332 0.46094 6.4883 1.8359 9.3555 3.5977 2.3359 1.4336 4.5039 3.125 6.6289 4.8516 1.9961 1.6211 4.3125 3.0547 6.6133 4.2266 9.2891 4.7344 20.438 3.8203 30.586 1.4375 5.2383-1.2305 10.578-2.8984 14.926-6.1836 6.7266-5.0859 8.9297-14.395 7.8438-22.422zm-4.8281 6.4727c-0.72266 1.1875-1.668 2.2617-2.8828 3.2812-7.0078 5.8906-16.16 8.4453-25.078 9.5938-0.6875 0.089844-1.3789 0.16406-2.0703 0.21875-4.8398 0.39453-9.8867-0.14453-14.156-2.4648-3.5-1.9062-6.2891-4.8945-9.6719-7.0078-2.5664-1.6016-5.4453-2.6719-8.4102-3.2578-3.9062-0.77734-8.1094-0.79687-12.09-0.80859-1.0898-0.003907-2.1875 0.007812-3.2617-0.19141-1.0703-0.20312-2.1289-0.63672-2.8945-1.4141-1.1055-1.125-1.4414-2.8242-1.2969-4.3945 0.22656-2.4961 1.6172-4.8438 3.6406-6.3125 1.0859-0.78906 2.3438-1.4297 3.5156-2.0898 1.3789-0.77344 2.7852-1.4922 4.2188-2.1641 3.1133-1.4609 6.3203-2.707 9.5703-3.832 4.8477-1.6797 9.8203-2.9922 14.848-4.0039 9.1211-1.8398 18.773-2.7148 27.852-0.19141 6.2383 1.7305 12.262 5.0977 16.391 10.16 2.2188 2.7148 3.4766 5.3633 3.6406 7.6602 0.23438 3.2461-1.0664 5.918-1.8633 7.2188z"/>
                </svg>
                <span>Feeding</span>
              </button>
              <button
                type="button"
                onClick={() => setLogType('shedding')}
                className={`pet-detail__log-type-button ${
                  logType === 'shedding' ? 'pet-detail__log-type-button--active' : ''
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="5" cy="6" rx="2.5" ry="2" />
                  <ellipse cx="12" cy="6" rx="2.5" ry="2" />
                  <ellipse cx="19" cy="6" rx="2.5" ry="2" />
                  <ellipse cx="8.5" cy="10" rx="2.5" ry="2" />
                  <ellipse cx="15.5" cy="10" rx="2.5" ry="2" />
                  <ellipse cx="5" cy="14" rx="2.5" ry="2" />
                  <ellipse cx="12" cy="14" rx="2.5" ry="2" />
                  <ellipse cx="19" cy="14" rx="2.5" ry="2" />
                  <ellipse cx="8.5" cy="18" rx="2.5" ry="2" />
                  <ellipse cx="15.5" cy="18" rx="2.5" ry="2" />
                  <path d="M3.5 7.5c.5.5 1 1 1.5 1" />
                  <path d="M10.5 7.5c.5.5 1 1 1.5 1" />
                  <path d="M17.5 7.5c.5.5 1 1 1.5 1" />
                </svg>
                <span>Shedding</span>
              </button>
              <button
                type="button"
                onClick={() => setLogType('note')}
                className={`pet-detail__log-type-button ${
                  logType === 'note' ? 'pet-detail__log-type-button--active' : ''
                }`}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>Note</span>
              </button>
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
