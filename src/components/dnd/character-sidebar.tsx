'use client'

import { useCharacter } from '@/store/character-store'
import { COIN_TYPES } from '@/lib/dnd'

/**
 * Page 2 bottom row — Languages (+ Alignment), Equipment (+ Magic Item
 * Attunement), and Coins. Laid out as a 3-column grid so the spell cards
 * above can take the full page width.
 *
 * (The Appearance and Backstory & Personality panels have been removed
 * per the user's request — they were considered redundant.)
 */
export function CharacterSidebar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <LanguagesPanel />
      <EquipmentPanel />
      <CoinsPanel />
    </div>
  )
}

function LanguagesPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  return (
    <div className="sheet-panel p-2 flex flex-col">
      <div className="sheet-label-lg mb-1">LANGUAGES</div>
      <textarea
        value={sheet.languages}
        onChange={(e) => setField('languages', e.target.value)}
        rows={3}
        placeholder="Common, Elvish, …"
        className="w-full bg-transparent border-0 outline-none text-xs resize-none sheet-grid p-1 flex-1 min-h-[60px]"
        style={{ color: 'var(--ink)' }}
        aria-label="Languages"
      />
      {/* Alignment lives here now — moved out of the deleted Backstory panel */}
      <div className="flex items-center gap-2 mt-1 pt-1 border-t"
           style={{ borderColor: 'var(--rule-light)' }}>
        <span className="sheet-label whitespace-nowrap">ALIGNMENT</span>
        <input
          type="text"
          value={sheet.alignment}
          onChange={(e) => setField('alignment', e.target.value)}
          className="sheet-input-line text-xs font-bold"
          placeholder="Chaotic Good"
          aria-label="Alignment"
        />
      </div>
    </div>
  )
}

function EquipmentPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  return (
    <div className="sheet-panel p-2 flex flex-col">
      <div className="sheet-label-lg mb-1">EQUIPMENT</div>
      <textarea
        value={sheet.equipment}
        onChange={(e) => setField('equipment', e.target.value)}
        rows={4}
        placeholder="Backpack, rope, torches, rations, weapons…"
        className="w-full bg-transparent border-0 outline-none text-xs resize-none sheet-grid p-1 min-h-[80px] flex-1"
        style={{ color: 'var(--ink)' }}
        aria-label="Equipment"
      />
      <div className="sheet-label mt-1 pt-1 border-t text-left"
           style={{ borderColor: 'var(--rule-light)' }}>
        Magic Item Attunement
      </div>
      <textarea
        value={sheet.magicItemAttunement}
        onChange={(e) => setField('magicItemAttunement', e.target.value)}
        rows={1}
        placeholder="Attuned magic items (max 3)…"
        className="w-full bg-transparent border-0 outline-none text-xs resize-none"
        style={{ color: 'var(--ink)' }}
        aria-label="Magic item attunement"
      />
    </div>
  )
}

function CoinsPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setCoin = useCharacter((s) => s.setCoin)

  return (
    <div className="sheet-panel p-2 flex flex-col">
      <div className="sheet-label-lg mb-1">COINS</div>
      <div className="grid grid-cols-5 gap-1 flex-1 items-start">
        {COIN_TYPES.map((c) => (
          <div
            key={c}
            className="flex flex-col items-center"
          >
            <div
              className="sheet-label uppercase font-extrabold"
              style={{ color: 'var(--ink)' }}
            >
              {c}
            </div>
            <div className="sheet-coin coin-purse flex items-start justify-center pt-0.5">
              <input
                type="text"
                inputMode="numeric"
                value={sheet.coins[c]}
                onChange={(e) => setCoin(c, e.target.value)}
                className="w-10 bg-transparent border-0 outline-none text-center text-sm font-bold mt-0.5"
                style={{ color: 'var(--ink)' }}
                aria-label={`Coins (${c})`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
