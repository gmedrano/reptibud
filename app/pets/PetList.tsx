'use client'

import { useRouter } from 'next/navigation'
import { Pet } from '@/lib/types'
import Card from '@/components/Card/Card'
import Button from '@/components/Button/Button'
import EmptyState from '@/components/EmptyState/EmptyState'
import './pets.css'

interface PetListProps {
  pets: Pet[]
}

export default function PetList({ pets }: PetListProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (pets.length === 0) {
    return (
      <div className="pets-page">
        <div className="pets-page__header">
          <div>
            <p className="pets-page__greeting">{getGreeting()}</p>
            <h1 className="pets-page__title">My Pets</h1>
          </div>
          <Button onClick={handleLogout} variant="secondary">
            Logout
          </Button>
        </div>
        <EmptyState
          title="No pets yet"
          message="Add your first reptile to start tracking their care"
          action={{
            label: 'Add Pet',
            onClick: () => router.push('/pets/new'),
          }}
        />
      </div>
    )
  }

  return (
    <div className="pets-page">
      <div className="pets-page__header">
        <div>
          <p className="pets-page__greeting">{getGreeting()}</p>
          <h1 className="pets-page__title">My Pets</h1>
        </div>
        <Button onClick={handleLogout} variant="secondary">
          Logout
        </Button>
      </div>

      <div className="pets-page__actions">
        <Button onClick={() => router.push('/pets/new')} fullWidth>
          Add Pet
        </Button>
      </div>

      <div className="pets-page__list">
        {pets.map((pet) => (
          <Card key={pet.id} onClick={() => router.push(`/pets/${pet.id}`)}>
            <div className="pet-card">
              {pet.photoUrl && (
                <img src={pet.photoUrl} alt={pet.name} className="pet-card__image" />
              )}
              <div className="pet-card__content">
                <h2 className="pet-card__name">{pet.name}</h2>
                <p className="pet-card__species">{pet.species}</p>
                <p className="pet-card__logs">{pet.logs.length} log entries</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
