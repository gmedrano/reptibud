import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPet } from '@/lib/storage/pets'
import PetDetail from './PetDetail'

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { id } = await params
  const pet = await getPet(user.id, id)

  if (!pet) {
    redirect('/pets')
  }

  return <PetDetail pet={pet} />
}
