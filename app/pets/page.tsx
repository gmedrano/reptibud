import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPets } from '@/lib/storage/pets'
import PetList from './PetList'

export default async function PetsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const pets = await getPets(user.id)

  return <PetList pets={pets} />
}
