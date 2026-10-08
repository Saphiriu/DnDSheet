'use client'

import { useCharacter } from '@/store/character-store'
import {
  suggestedSpellSlots,
  abilityModifier,
  proficiencyBonusByLevel,
  spellSaveDC as calcSpellSaveDC,
  spellAttackBonus as calcSpellAttackBonus,
  signed,
  type AbilityKey,
} from '@/lib/dnd'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Top of page 2 left column: spellcasting ability, modifier, save DC,
 * spell attack bonus. Plus the 3x3 spell slots grid to its right.
 *
 * Spellcasting Ability is editable (chosen by the player). Modifier / Save
 * DC / Spell Attack Bonus are auto-derived at render time from the chosen
 * spellcasting ability's score + level-based proficiency bonus.
 */
const ABILITY_MAP: Record<string, AbilityKey> = {
  Strength: 'str', Dexterity: 'dex', Constitution: 'con',
  Intelligence: 'int', Wisdom: 'wis', Charisma: 'cha',
}

export function SpellcastingHeader() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  const setSpellSlotTotal = useCharacter((s) => s.setSpellSlotTotal)
  const toggleSpellSlotExpended = useCharacter((s) => s.toggleSpellSlotExpended)

  // --- Derived spellcasting stats ---
  const level = typeof sheet.level === 'number' ? sheet.level : 1
  const prof = proficiencyBonusByLevel(level)

  const spellAbKey = ABILITY_MAP[sheet.spellcastingAbility] ?? null
  const spellScore = spellAbKey
    ? (typeof sheet.abilities[spellAbKey].score === 'number'
        ? (sheet.abilities[spellAbKey].score as number)
        : 10)
    : 10
  const spellMod = abilityModifier(spellScore)
  const saveDC = calcSpellSaveDC(prof, spellMod)
  const atkBonus = calcSpellAttackBonus(prof, spellMod)

  function autoFillSlots() {
    const lvl = typeof sheet.level === 'number' ? sheet.level : 1
    const suggested = suggestedSpellSlots(lvl)
    suggested.forEach((total, idx) => {
      setSpellSlotTotal(idx + 1, total)
    })
    toast.success(`Filled spell slots for level ${lvl} (full caster)`)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2">
      {/* Spellcasting stats (left) */}
      <div className="sheet-panel p-2 flex flex-col gap-1.5">
        <div className="sheet-label-lg text-center">SPELLCASTING</div>

        {/* Spellcasting ability — editable choice */}
        <div className="flex flex-col">
          <div className="sheet-label text-left">Spellcasting Ability</div>
          <select
            value={sheet.spellcastingAbility}
            onChange={(e) => setField('spellcastingAbility', e.target.value)}
            className="sheet-input-line text-sm font-bold bg-transparent cursor-pointer"
            aria-label="Spellcasting ability"
          >
            <option value="">— choose —</option>
            {Object.keys(ABILITY_MAP).map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Derived stats — read-only */}
        <DerivedStat label="Spellcasting Modifier" value={signed(spellMod)} />
        <DerivedStat label="Spell Save DC" value={String(saveDC)} />
        <DerivedStat label="Spell Attack Bonus" value={signed(atkBonus)} />
      </div>

      {/* Spell slots (3x3 grid) */}
      <div className="sheet-panel p-2">
        <div className="flex items-center justify-between mb-1">
          <div className="sheet-label-lg">SPELL SLOTS</div>
          <button
            type="button"
            onClick={autoFillSlots}
            className="text-[10px] flex items-center gap-1"
            style={{ color: 'var(--ink-soft)' }}
            title="Auto-fill from full caster table"
          >
            <RefreshCw className="w-3 h-3" /> auto-fill
          </button>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {sheet.spellSlots.map((slot, idx) => {
            const level = idx + 1
            const slotsArr = Array.from({ length: slot.total }, (_, i) => i < slot.expended)
            return (
              <div
                key={level}
                className="border p-1 flex flex-col items-center"
                style={{ borderColor: 'var(--rule)' }}
              >
                <div className="sheet-label">LEVEL {level}</div>
                <div
                  className="text-[9px] font-bold uppercase flex gap-2 w-full justify-center"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  <span>
                    Total: <input
                      type="number"
                      min={0}
                      max={9}
                      value={slot.total}
                      onChange={(e) =>
                        setSpellSlotTotal(
                          level,
                          Math.max(0, Math.min(9, parseInt(e.target.value, 10) || 0)),
                        )
                      }
                      className="w-5 bg-transparent border-0 border-b outline-none text-center"
                      style={{ borderColor: 'var(--rule)' }}
                      aria-label={`Total level ${level} slots`}
                    />
                  </span>
                  <span>Exp: {slot.expended}</span>
                </div>
                <div className="flex flex-wrap justify-center gap-1 mt-1">
                  {slotsArr.length === 0 ? (
                    <span
                      className="text-[10px] italic"
                      style={{ color: 'var(--ink-faint)' }}
                    >
                      —
                    </span>
                  ) : (
                    slotsArr.map((expended, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleSpellSlotExpended(level, i)}
                        className={`sheet-diamond ${expended ? 'is-filled' : ''}`}
                        aria-label={`Level ${level} slot ${i + 1} expended`}
                        style={{ width: 11, height: 11 }}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function DerivedStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <div className="sheet-label text-left">{label}</div>
      <div
        className="text-sm font-bold py-1"
        style={{ color: 'var(--ink)' }}
        aria-label={label}
        title={`${label} — auto-derived`}
      >
        {value}
      </div>
    </div>
  )
}
