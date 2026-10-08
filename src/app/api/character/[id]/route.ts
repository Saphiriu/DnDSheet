import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * GET    /api/character/[id]  → { ok, character: { id, name, data (parsed), updatedAt } }
 * DELETE /api/character/[id]  → { ok }
 */

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const char = await db.character.findUnique({ where: { id } })
    if (!char) {
      return NextResponse.json(
        { ok: false, error: 'Character not found' },
        { status: 404 },
      )
    }
    let parsed: unknown = null
    try {
      parsed = JSON.parse(char.data)
    } catch {
      parsed = char.data
    }
    return NextResponse.json({
      ok: true,
      character: {
        id: char.id,
        name: char.name,
        data: parsed,
        createdAt: char.createdAt,
        updatedAt: char.updatedAt,
      },
    })
  } catch (err) {
    console.error('GET /api/character/[id] failed:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to load character' },
      { status: 500 },
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    await db.character.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/character/[id] failed:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to delete character' },
      { status: 500 },
    )
  }
}
