'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useCharacter } from '@/store/character-store'

/**
 * The right column of page 1: Weapons table, Class Features, Species Traits,
 * Feats, plus the Damage Cantrips row that overlaps the weapons panel.
 */
export function FeaturesColumn() {
  return (
    <div className="flex flex-col gap-2">
      <WeaponsPanel />
      <DamageCantripsPanel />
      <ClassFeaturesPanel />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <SpeciesTraitsPanel />
        <FeatsPanel />
      </div>
    </div>
  )
}

function WeaponsPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const addWeapon = useCharacter((s) => s.addWeapon)
  const updateWeapon = useCharacter((s) => s.updateWeapon)
  const removeWeapon = useCharacter((s) => s.removeWeapon)

  return (
    <div className="sheet-panel p-2">
      <div className="sheet-label-lg mb-1">WEAPONS &amp; DAMAGE</div>
      <div
        className="grid grid-cols-[1fr_90px_130px_1fr_24px] gap-1 text-[10px] font-bold uppercase pb-1 border-b"
        style={{ color: 'var(--ink-soft)', borderColor: 'var(--rule)' }}
      >
        <div>Name</div>
        <div className="text-center">Atk Bonus / DC</div>
        <div>Damage &amp; Type</div>
        <div>Notes</div>
        <div />
      </div>
      <div className="max-h-60 overflow-y-auto sheet-scroll">
        {sheet.weapons.length === 0 ? (
          <div
            className="text-[11px] italic py-2 text-center"
            style={{ color: 'var(--ink-faint)' }}
          >
            No weapons yet
          </div>
        ) : (
          sheet.weapons.map((w) => (
            <div
              key={w.id}
              className="grid grid-cols-[1fr_90px_130px_1fr_24px] gap-1 py-0.5 items-center"
            >
              <input
                type="text"
                value={w.name}
                onChange={(e) => updateWeapon(w.id, { name: e.target.value })}
                className="sheet-input-line text-xs"
                placeholder="Longsword"
                aria-label="Weapon name"
              />
              <input
                type="text"
                value={w.atkBonus}
                onChange={(e) => updateWeapon(w.id, { atkBonus: e.target.value })}
                className="sheet-input-box text-xs w-full"
                placeholder="+5"
                aria-label="Attack bonus"
              />
              <input
                type="text"
                value={w.damage}
                onChange={(e) => updateWeapon(w.id, { damage: e.target.value })}
                className="sheet-input-line text-xs"
                placeholder="1d8+3 slashing"
                aria-label="Damage"
              />
              <input
                type="text"
                value={w.notes}
                onChange={(e) => updateWeapon(w.id, { notes: e.target.value })}
                className="sheet-input-line text-xs"
                placeholder="Finesse, light"
                aria-label="Weapon notes"
              />
              <button
                type="button"
                onClick={() => removeWeapon(w.id)}
                className="text-[10px]"
                style={{ color: 'var(--blood)' }}
                aria-label="Remove weapon"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
      <button
        type="button"
        onClick={addWeapon}
        className="mt-1 text-[11px] flex items-center gap-1 hover:underline"
        style={{ color: 'var(--ink-soft)' }}
      >
        <Plus className="w-3 h-3" /> Add weapon
      </button>
    </div>
  )
}

function DamageCantripsPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  return (
    <div className="sheet-panel p-2">
      <div className="sheet-label mb-1">DAMAGE CANTRIPS (free text)</div>
      <textarea
        value={sheet.damageCantrips}
        onChange={(e) => setField('damageCantrips', e.target.value)}
        rows={2}
        className="w-full bg-transparent border-0 outline-none text-xs resize-none sheet-grid p-1"
        style={{ color: 'var(--ink)' }}
        placeholder="e.g. Fire Bolt — 1d10 fire (range 120ft)"
        aria-label="Damage cantrips"
      />
    </div>
  )
}

function ClassFeaturesPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  return (
    <div className="sheet-panel p-2 flex-1 min-h-[140px]">
      <div className="sheet-label-lg mb-1">CLASS FEATURES</div>
      <textarea
        value={sheet.classFeatures}
        onChange={(e) => setField('classFeatures', e.target.value)}
        rows={6}
        className="w-full bg-transparent border-0 outline-none text-xs resize-none sheet-grid p-1 min-h-[120px]"
        style={{ color: 'var(--ink)' }}
        aria-label="Class features"
      />
    </div>
  )
}

function SpeciesTraitsPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  return (
    <div className="sheet-panel p-2 flex flex-col min-h-[120px]">
      <div className="sheet-label-lg mb-1">SPECIES TRAITS</div>
      <textarea
        value={sheet.speciesTraits}
        onChange={(e) => setField('speciesTraits', e.target.value)}
        rows={5}
        className="w-full bg-transparent border-0 outline-none text-xs resize-none sheet-grid p-1 flex-1"
        style={{ color: 'var(--ink)' }}
        aria-label="Species traits"
      />
    </div>
  )
}

function FeatsPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  return (
    <div className="sheet-panel p-2 flex flex-col min-h-[120px]">
      <div className="sheet-label-lg mb-1">FEATS</div>
      <textarea
        value={sheet.feats}
        onChange={(e) => setField('feats', e.target.value)}
        rows={5}
        className="w-full bg-transparent border-0 outline-none text-xs resize-none sheet-grid p-1 flex-1"
        style={{ color: 'var(--ink)' }}
        aria-label="Feats"
      />
    </div>
  )
}
