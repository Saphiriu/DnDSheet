'use client'

import { useCharacter } from '@/store/character-store'

/**
 * Top header row of page 1: Character Name, Background/Class/Species/Subclass,
 * Level, XP, Armor Class, Hit Points, Hit Dice, Death Saves.
 *
 * Layout is faithful to the official sheet's first row.
 */
export function CombatHeader() {
  const sheet = useCharacter((s) => s.sheet)
  const setField = useCharacter((s) => s.setField)
  const toggleDeathSave = useCharacter((s) => s.toggleDeathSave)

  return (
    <div className="sheet-panel p-3">
      <div className="grid grid-cols-12 gap-2">
        {/* Character name + identity line */}
        <div className="col-span-12 md:col-span-5 flex flex-col">
          <div className="sheet-label text-left mb-1" style={{ color: 'var(--ink)' }}>
            CHARACTER NAME
          </div>
          <input
            type="text"
            value={sheet.characterName}
            onChange={(e) => setField('characterName', e.target.value)}
            className="w-full bg-transparent border-0 border-b-2 outline-none text-xl font-bold pb-1"
            style={{
              borderColor: 'var(--rule)',
              color: 'var(--ink)',
            }}
            aria-label="Character name"
          />
          <div className="grid grid-cols-4 gap-1 mt-2">
            <IdentityField
              label="BACKGROUND"
              value={sheet.background}
              onChange={(v) => setField('background', v)}
            />
            <IdentityField
              label="CLASS"
              value={sheet.class}
              onChange={(v) => setField('class', v)}
            />
            <IdentityField
              label="SPECIES"
              value={sheet.species}
              onChange={(v) => setField('species', v)}
            />
            <IdentityField
              label="SUBCLASS"
              value={sheet.subclass}
              onChange={(v) => setField('subclass', v)}
            />
          </div>
        </div>

        {/* Level + XP oval */}
        <div className="col-span-6 md:col-span-2 flex flex-col items-center justify-center sheet-oval py-2">
          <div className="sheet-label">LEVEL</div>
          <input
            type="number"
            min={1}
            max={20}
            value={sheet.level}
            onChange={(e) =>
              setField('level', e.target.value === '' ? 1 : parseInt(e.target.value, 10))
            }
            className="w-12 bg-transparent border-0 outline-none text-2xl font-extrabold text-center"
            style={{ color: 'var(--ink)' }}
            aria-label="Level"
          />
          <div className="sheet-label mt-1">XP</div>
          <input
            type="number"
            min={0}
            value={sheet.xp}
            onChange={(e) =>
              setField('xp', e.target.value === '' ? 0 : parseInt(e.target.value, 10))
            }
            className="w-20 bg-transparent border-0 border-b outline-none text-center text-sm font-bold"
            style={{ borderColor: 'var(--rule)', color: 'var(--ink)' }}
            aria-label="XP"
          />
        </div>

        {/* Armor Class (shield) */}
        <div className="col-span-6 md:col-span-2 flex flex-col items-center">
          <div className="sheet-label">ARMOR CLASS</div>
          <div className="sheet-shield w-20 h-24 flex flex-col items-center justify-start pt-1.5">
            <input
              type="text"
              value={sheet.armorClass}
              onChange={(e) => setField('armorClass', e.target.value)}
              className="w-12 bg-transparent border-0 outline-none text-2xl font-extrabold text-center"
              style={{ color: 'var(--ink)' }}
              aria-label="Armor Class"
            />
            <div className="sheet-label mt-0.5">SHIELD</div>
            <input
              type="text"
              value={sheet.shield}
              onChange={(e) => setField('shield', e.target.value)}
              className="w-10 bg-transparent border-0 border-b outline-none text-center text-xs"
              style={{ borderColor: 'var(--rule)', color: 'var(--ink-soft)' }}
              aria-label="Shield bonus"
            />
          </div>
        </div>

        {/* Hit points */}
        <div className="col-span-6 md:col-span-2 flex flex-col">
          <div className="sheet-label mb-1">HIT POINTS</div>
          <div className="grid grid-cols-3 gap-1">
            <HPField
              label="TEMP"
              value={sheet.hpTemp}
              onChange={(v) => setField('hpTemp', v)}
            />
            <HPField
              label="CURRENT"
              value={sheet.hpCurrent}
              onChange={(v) => setField('hpCurrent', v)}
              big
            />
            <HPField
              label="MAX"
              value={sheet.hpMax}
              onChange={(v) => setField('hpMax', v)}
            />
          </div>
        </div>

        {/* Hit dice + death saves */}
        <div className="col-span-6 md:col-span-1 flex flex-col">
          <div className="sheet-label mb-1">HIT DICE</div>
          <div className="grid grid-cols-2 gap-1">
            <HPField
              label="SPENT"
              value={sheet.hitDiceSpent}
              onChange={(v) => setField('hitDiceSpent', v)}
            />
            <HPField
              label="MAX"
              value={sheet.hitDiceMax}
              onChange={(v) => setField('hitDiceMax', v)}
            />
          </div>
          <div className="sheet-label mt-1">DEATH SAVES</div>
          <div className="flex flex-col gap-1 mt-0.5">
            <div className="flex items-center gap-1">
              <span
                className="text-[9px] font-bold w-9"
                style={{ color: 'var(--ink-soft)' }}
              >
                SUCC.
              </span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDeathSave('success', i)}
                    className={`sheet-diamond ${
                      sheet.deathSavesSuccesses[i] ? 'is-filled' : ''
                    }`}
                    aria-label={`Death save success ${i + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span
                className="text-[9px] font-bold w-9"
                style={{ color: 'var(--ink-soft)' }}
              >
                FAIL.
              </span>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDeathSave('failure', i)}
                    className={`sheet-diamond ${
                      sheet.deathSavesFailures[i] ? 'is-filled' : ''
                    }`}
                    aria-label={`Death save failure ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function IdentityField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col">
      <div className="sheet-label text-left">{label}</div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sheet-input-line text-xs font-bold"
        aria-label={label}
      />
    </div>
  )
}

function HPField({
  label,
  value,
  onChange,
  big = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  big?: boolean
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="sheet-label">{label}</div>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent border-0 border-b outline-none text-center font-bold ${
          big ? 'text-2xl' : 'text-sm'
        }`}
        style={{
          borderColor: 'var(--rule)',
          color: 'var(--ink)',
        }}
        aria-label={label}
      />
    </div>
  )
}
