import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { addLogEntry } from '@/lib/storage/pets'
import { LogType } from '@/lib/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { type, content } = body

    if (!type || !content) {
      return NextResponse.json(
        { error: 'Type and content are required' },
        { status: 400 }
      )
    }

    const validTypes: LogType[] = ['feeding', 'shedding', 'note']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid log type' },
        { status: 400 }
      )
    }

    const pet = await addLogEntry(user.id, id, { type, content })

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    return NextResponse.json(pet, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add log entry' },
      { status: 500 }
    )
  }
}
