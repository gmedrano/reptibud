import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getPet, updatePet } from '@/lib/storage/pets'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; logId: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, logId } = await params
    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const pet = await getPet(user.id, id)
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    const logIndex = pet.logs.findIndex(log => log.id === logId)
    if (logIndex === -1) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 })
    }

    pet.logs[logIndex] = {
      ...pet.logs[logIndex],
      content,
    }

    const updatedPet = await updatePet(user.id, id, { ...pet })
    return NextResponse.json(updatedPet)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update log' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; logId: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, logId } = await params
    const pet = await getPet(user.id, id)
    
    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    const logExists = pet.logs.some(log => log.id === logId)
    if (!logExists) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 })
    }

    pet.logs = pet.logs.filter(log => log.id !== logId)

    const updatedPet = await updatePet(user.id, id, { ...pet })
    return NextResponse.json(updatedPet)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete log' },
      { status: 500 }
    )
  }
}
