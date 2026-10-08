'use client'

import { useState } from 'react'
import { Dices, X, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react'
import { useCharacter } from '@/store/character-store'

/**
 * Floating interactive dice roller.
 * Supports d20 (with advantage / disadvantage) and arbitrary NdM+K.
 * Pulls live modifiers from the loaded character for one-click rolls.
 */
export function DiceRoller() {
  const [open, setOpen] = useState(false)
  const [adv, setAdv] = useState(false)
  const [dis, setDis] = useState(false)
  const [count, setCount] = useState(1)
  const [faces, setFaces] = useState(20)
  const [mod, setMod] = useState(0)
  const [note, setNote] = useState('')

  const rolls = useCharacter((s) => s.rolls)
  const rollD20 = useCharacter((s) => s.rollD20)
  const rollDice = useCharacter((s) => s.rollDice)
  const clearRolls = useCharacter((s) => s.clearRolls)
  const sheet = useCharacter((s) => s.sheet)

  function doD20(m: number, label: string) {
    rollD20(m, label, { advantage: adv && !dis, disadvantage: dis && !adv })
  }

  function doCustom() {
    if (faces < 2 || faces > 1000) return
    const c = Math.max(1, Math.min(100, count))
    rollDice(c, faces, mod, note || `${c}d${faces}${mod >= 0 ? '+' : ''}${mod}`)
    setNote('')
  }

  // Helper: quick-roll shortcuts tied to the current character.
  function quickRolls() {
    const level = typeof sheet.level === 'number' ? sheet.level : 1
    const prof = (() => {
      if (level >= 17) return 6
      if (level >= 13) return 5
      if (level >= 9) return 4
      if (level >= 5) return 3
      return 2
    })()

    const abilityMod = (n?: number | '') =>
      typeof n === 'number' && !Number.isNaN(n)
        ? Math.floor((n - 10) / 2)
        : 0

    const dexMod = abilityMod(sheet.abilities.dex.score)
    const strMod = abilityMod(sheet.abilities.str.score)
    const conMod = abilityMod(sheet.abilities.con.score)
    const intMod = abilityMod(sheet.abilities.int.score)
    const wisMod = abilityMod(sheet.abilities.wis.score)
    const chaMod = abilityMod(sheet.abilities.cha.score)

    return [
      { label: 'Initiative', mod: dexMod },
      { label: 'STR save', mod: strMod + (sheet.abilities.str.saveProficient ? prof : 0) },
      { label: 'DEX save', mod: dexMod + (sheet.abilities.dex.saveProficient ? prof : 0) },
      { label: 'CON save', mod: conMod + (sheet.abilities.con.saveProficient ? prof : 0) },
      { label: 'INT save', mod: intMod + (sheet.abilities.int.saveProficient ? prof : 0) },
      { label: 'WIS save', mod: wisMod + (sheet.abilities.wis.saveProficient ? prof : 0) },
      { label: 'CHA save', mod: chaMod + (sheet.abilities.cha.saveProficient ? prof : 0) },
    ]
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 print:hidden">
      {open ? (
        <div
          className="sheet-panel w-[340px] p-4 shadow-2xl"
          style={{ clipPath: 'none' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="sheet-label-lg flex items-center gap-2">
              <Dices className="w-4 h-4" /> DICE TOWER
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-ink-soft hover:text-ink p-1"
              aria-label="Close dice roller"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* d20 quick rolls */}
          <div className="mb-3">
            <div className="sheet-label mb-1">d20 rolls</div>
            <div className="grid grid-cols-2 gap-1 mb-2">
              <button
                type="button"
                onClick={() => setAdv(!adv)}
                className={`text-xs font-bold py-1 px-2 border transition-colors ${
                  adv && !dis
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'border-rule text-ink-soft hover:bg-rule/10'
                }`}
                style={{
                  backgroundColor: adv && !dis ? '#1f5e3f' : 'transparent',
                  color: adv && !dis ? '#fff' : 'var(--ink-soft)',
                  borderColor: 'var(--rule)',
                }}
              >
                Advantage
              </button>
              <button
                type="button"
                onClick={() => setDis(!dis)}
                className={`text-xs font-bold py-1 px-2 border transition-colors`}
                style={{
                  backgroundColor: dis && !adv ? '#7a1414' : 'transparent',
                  color: dis && !adv ? '#fff' : 'var(--ink-soft)',
                  borderColor: 'var(--rule)',
                }}
              >
                Disadvantage
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1 mb-2">
              {quickRolls().map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => doD20(q.mod, q.label)}
                  className="text-xs py-1.5 px-1 border hover:bg-rule/10 transition-colors"
                  style={{
                    borderColor: 'var(--rule)',
                    color: 'var(--ink)',
                  }}
                >
                  <span className="font-bold">{q.label}</span>
                  <span className="ml-1 opacity-60">
                    ({q.mod >= 0 ? '+' : ''}
                    {q.mod})
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => doD20(mod, note || `d20${mod >= 0 ? '+' : ''}${mod}`)}
              className="w-full text-sm font-bold py-2 border-2 transition-colors"
              style={{
                borderColor: 'var(--rule)',
                backgroundColor: 'var(--blood)',
                color: '#fff',
              }}
            >
              Roll d20 {mod >= 0 ? '+' : ''}
              {mod} {adv && !dis ? '(adv)' : dis && !adv ? '(dis)' : ''}
            </button>
          </div>

          {/* arbitrary NdM */}
          <div className="mb-3 border-t pt-3" style={{ borderColor: 'var(--rule-light)' }}>
            <div className="sheet-label mb-1">custom dice</div>
            <div className="flex items-center gap-2 mb-2">
              <Stepper label="Dice" value={count} min={1} max={50} onChange={setCount} />
              <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>d</span>
              <Stepper label="Sides" value={faces} min={2} max={100} onChange={setFaces} />
              <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>+</span>
              <Stepper label="Mod" value={mod} min={-50} max={50} onChange={setMod} />
            </div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Roll label (optional)"
              className="sheet-input-line text-sm mb-2"
            />
            <button
              type="button"
              onClick={doCustom}
              className="w-full text-sm font-bold py-2 border-2 transition-colors"
              style={{
                borderColor: 'var(--rule)',
                backgroundColor: 'var(--ink)',
                color: 'var(--parchment)',
              }}
            >
              Roll {count}d{faces}
              {mod !== 0 && (mod >= 0 ? `+${mod}` : mod)}
            </button>
          </div>

          {/* history */}
          {rolls.length > 0 ? (
            <div className="border-t pt-2" style={{ borderColor: 'var(--rule-light)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="sheet-label">history</span>
                <button
                  type="button"
                  onClick={clearRolls}
                  className="text-xs flex items-center gap-1"
                  style={{ color: 'var(--ink-soft)' }}
                >
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="max-h-40 overflow-y-auto sheet-scroll space-y-1">
                {rolls.map((r) => (
                  <div
                    key={r.id}
                    className="text-xs p-1.5 border"
                    style={{
                      borderColor: 'var(--rule-light)',
                      backgroundColor: 'rgba(255, 245, 210, 0.5)',
                    }}
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold" style={{ color: 'var(--ink)' }}>
                        {r.expression}
                      </span>
                      <span
                        className="text-base font-extrabold"
                        style={{ color: 'var(--blood)' }}
                      >
                        {r.final}
                      </span>
                    </div>
                    {r.note && (
                      <div className="text-[10px]" style={{ color: 'var(--ink-soft)' }}>
                        {r.note}
                      </div>
                    )}
                    <div className="text-[10px]" style={{ color: 'var(--ink-faint)' }}>
                      rolls: [{r.rolls.join(', ')}]
                      {r.advantage ? ' (adv)' : ''}
                      {r.disadvantage ? ' (dis)' : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-105"
        style={{
          backgroundColor: 'var(--blood)',
          color: 'var(--parchment)',
        }}
        aria-label="Open dice roller"
      >
        <Dices className="w-6 h-6" />
        {rolls.length > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 text-[10px] rounded-full flex items-center justify-center font-bold"
            style={{
              backgroundColor: 'var(--gold)',
              color: 'var(--ink)',
            }}
          >
            {rolls.length > 9 ? '9+' : rolls.length}
          </span>
        )}
      </button>
    </div>
  )
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  return (
    <div className="flex-1">
      <div className="sheet-label mb-0.5">{label}</div>
      <div
        className="flex items-center border"
        style={{ borderColor: 'var(--rule)' }}
      >
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="px-1 py-1"
          style={{ color: 'var(--ink-soft)' }}
          aria-label={`Decrease ${label}`}
        >
          <ChevronDown className="w-3 h-3" />
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const n = parseInt(e.target.value, 10)
            if (!Number.isNaN(n)) onChange(Math.max(min, Math.min(max, n)))
          }}
          className="w-10 text-center bg-transparent outline-none text-sm font-bold"
          style={{ color: 'var(--ink)' }}
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="px-1 py-1"
          style={{ color: 'var(--ink-soft)' }}
          aria-label={`Increase ${label}`}
        >
          <ChevronUp className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
