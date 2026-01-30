import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createPet, getPets } from '@/lib/storage/pets'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pets = await getPets(user.id)
    return NextResponse.json(pets)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch pets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, species, photoUrl } = body

    if (!name || !species) {
      return NextResponse.json(
        { error: 'Name and species are required' },
        { status: 400 }
      )
    }

    const pet = await createPet(user.id, { name, species, photoUrl })
    return NextResponse.json(pet, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create pet' },
      { status: 500 }
    )
  }
}
