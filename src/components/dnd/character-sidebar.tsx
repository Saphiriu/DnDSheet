'use client'

import { useCharacter } from '@/store/character-store'
import { COIN_TYPES } from '@/lib/dnd'

/**
 * Page 3 · Miscellaneous — bottom row of Languages (+ Alignment), Equipment
 * (+ Magic Item Attunement), Coins — plus a big Notes panel underneath.
 */
export function CharacterSidebar() {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <LanguagesPanel />
        <EquipmentPanel />
        <CoinsPanel />
      </div>
      <NotesPanel />
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
      <div className="grid grid-cols-4 gap-1 flex-1 items-start">
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

function NotesPanel() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  return (
    <div className="sheet-panel p-2 flex flex-col">
      <div className="sheet-label-lg mb-1">NOTES</div>
      <textarea
        value={sheet.notes}
        onChange={(e) => setField('notes', e.target.value)}
        rows={10}
        placeholder="Campaign notes, session log, NPC names, quest hooks, house rules, anything else…"
        className="w-full bg-transparent border-0 outline-none text-sm resize-y sheet-grid p-2 min-h-[240px]"
        style={{ color: 'var(--ink)', fieldSizing: 'content' as React.CSSProperties['fieldSizing'] }}
        aria-label="Notes"
      />
    </div>
  )
}
