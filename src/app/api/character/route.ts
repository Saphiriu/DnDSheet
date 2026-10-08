import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET /api/character
 *   Returns the list of all saved characters (id, name, updatedAt only).
 *
 * POST /api/character
 *   Body: { name: string, data: CharacterSheetJSON }
 *   Saves a new character (or updates by id if `id` is provided in body).
 *   Returns { id, name, updatedAt }.
 */

export async function GET() {
  try {
    const chars = await db.character.findMany({
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, updatedAt: true, createdAt: true },
    })
    return NextResponse.json({ ok: true, characters: chars })
  } catch (err) {
    console.error('GET /api/character failed:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to list characters' },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, name, data } = body as {
      id?: string
      name?: string
      data?: unknown
    }
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { ok: false, error: 'Missing or invalid "name" field' },
        { status: 400 },
      )
    }
    if (data == null) {
      return NextResponse.json(
        { ok: false, error: 'Missing "data" field' },
        { status: 400 },
      )
    }
    const serialized =
      typeof data === 'string' ? data : JSON.stringify(data)

    if (id) {
      // Update existing
      const updated = await db.character.update({
        where: { id },
        data: { name, data: serialized },
        select: { id: true, name: true, updatedAt: true },
      })
      return NextResponse.json({ ok: true, character: updated })
    }

    // Create new
    const created = await db.character.create({
      data: { name, data: serialized },
      select: { id: true, name: true, updatedAt: true },
    })
    return NextResponse.json({ ok: true, character: created })
  } catch (err) {
    console.error('POST /api/character failed:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to save character' },
      { status: 500 },
    )
  }
}
