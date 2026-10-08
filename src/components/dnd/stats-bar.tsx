'use client'

import { useCharacter } from '@/store/character-store'
import {
  abilityModifier,
  proficiencyBonusByLevel,
  passivePerception,
  signed,
} from '@/lib/dnd'

/**
 * The 5-cell horizontal stat bar that appears below the identity header
 * on page 1: PROFICIENCY BONUS, INITIATIVE, SPEED, SIZE,
 * PASSIVE PERCEPTION.
 *
 * PROFICIENCY BONUS is auto-derived from level.
 * INITIATIVE is auto-derived from DEX modifier.
 * PASSIVE PERCEPTION is auto-derived from 10 + WIS mod + (PB if Perception is proficient).
 * SPEED and SIZE are editable.
 */
export function StatsBar() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)

  // --- Derived values ---
  const level = typeof sheet.level === 'number' ? sheet.level : 1
  const prof = proficiencyBonusByLevel(level)

  const dexScore = typeof sheet.abilities.dex.score === 'number' ? sheet.abilities.dex.score : 10
  const dexMod = abilityModifier(dexScore)

  const wisScore = typeof sheet.abilities.wis.score === 'number' ? sheet.abilities.wis.score : 10
  const wisMod = abilityModifier(wisScore)
  const perceptionProficient = sheet.skills.perception.proficient
  const pp = passivePerception(wisMod, prof, perceptionProficient)

  // Read-only derived cells
  const derivedCells: { label: string; value: string }[] = [
    { label: 'PROFICIENCY BONUS', value: signed(prof) },
    { label: 'INITIATIVE', value: signed(dexMod) },
    { label: 'PASSIVE PERCEPTION', value: String(pp) },
  ]

  // Editable cells
  const editableCells: { label: string; value: string; onChange: (v: string) => void }[] = [
    { label: 'SPEED', value: sheet.speed, onChange: (v) => setField('speed', v) },
    { label: 'SIZE', value: sheet.size, onChange: (v) => setField('size', v) },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5">
      {derivedCells.map((c) => (
        <div
          key={c.label}
          className="sheet-panel flex flex-col items-center justify-center py-1.5 px-1"
        >
          <div className="sheet-label">{c.label}</div>
          <div
            className="text-base font-extrabold mt-0.5"
            style={{ color: 'var(--ink)' }}
            aria-label={c.label}
            title={`${c.label} — auto-derived`}
          >
            {c.value}
          </div>
        </div>
      ))}
      {editableCells.map((c) => (
        <div
          key={c.label}
          className="sheet-panel flex flex-col items-center justify-center py-1.5 px-1"
        >
          <div className="sheet-label">{c.label}</div>
          <input
            type="text"
            value={c.value}
            onChange={(e) => c.onChange(e.target.value)}
            className="w-full bg-transparent border-0 outline-none text-center text-base font-extrabold mt-0.5"
            style={{ color: 'var(--ink)' }}
            aria-label={c.label}
          />
        </div>
      ))}
    </div>
  )
}
