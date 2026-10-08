'use client'

import { useCharacter } from '@/store/character-store'
import {
  ABILITY_NAMES,
  ABILITY_ORDER,
  SKILLS,
  abilityModifier,
  proficiencyBonusByLevel,
  skillCheckTotal,
  signed,
  type AbilityKey,
} from '@/lib/dnd'

/**
 * A single ability card — large circular modifier, trapezoidal score box,
 * saving-throw row, and the list of skills (with proficiency circles and
 * per-skill totals). Visually faithful to the official sheet.
 *
 * Skill totals are auto-derived:
 *   proficient + no expertise → ability mod + proficiency bonus
 *   proficient + expertise     → ability mod + 2 × proficiency bonus
 *   not proficient + JoAT on   → ability mod + 1 (flat)
 *   not proficient + JoAT off  → ability mod
 */
export function AbilityCard({ ability }: { ability: AbilityKey }) {
  const sheet = useCharacter((s) => s.sheet)
  const setAbilityScore = useCharacter((s) => s.setAbilityScore)
  const toggleAbilitySaveProficient = useCharacter(
    (s) => s.toggleAbilitySaveProficient,
  )
  const toggleSkillProficient = useCharacter((s) => s.toggleSkillProficient)
  const toggleSkillExpertise = useCharacter((s) => s.toggleSkillExpertise)

  const level = typeof sheet.level === 'number' ? sheet.level : 1
  const prof = proficiencyBonusByLevel(level)
  const joat = sheet.jackOfAllTrades

  const score = sheet.abilities[ability].score
  const scoreNum = typeof score === 'number' && !Number.isNaN(score) ? score : 0
  const mod = abilityModifier(scoreNum)

  const isSaveProficient = sheet.abilities[ability].saveProficient
  // Saving throws DO NOT benefit from Jack of All Trades — only skills do.
  const saveTotal = mod + (isSaveProficient ? prof : 0)

  // All skills belonging to this ability
  const skillsForAbility = SKILLS.filter((s) => s.ability === ability)

  return (
    <div
      className="sheet-panel p-2 flex flex-col gap-1.5"
      style={{ minWidth: 0 }}
    >
      {/* Ability name */}
      <div
        className="sheet-label-lg text-center"
        style={{ color: 'var(--ink)' }}
      >
        {ABILITY_NAMES[ability]}
      </div>

      {/* Modifier circle + Score box */}
      <div className="flex items-center justify-center gap-3 py-1">
        <div className="sheet-modifier-circle">
          <span className="sheet-modifier-value">{signed(mod)}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="sheet-label mb-0.5">score</div>
          <div className="sheet-score-box">
            <input
              type="number"
              min={1}
              max={30}
              value={score}
              onChange={(e) => {
                const v = e.target.value
                setAbilityScore(ability, v === '' ? '' : parseInt(v, 10))
              }}
              aria-label={`${ABILITY_NAMES[ability]} score`}
            />
          </div>
        </div>
      </div>

      {/* Saving throw row */}
      <div className="flex items-center gap-2 px-1 py-1 border-y">
        <button
          type="button"
          onClick={() => toggleAbilitySaveProficient(ability)}
          className={`sheet-circle ${isSaveProficient ? 'is-checked' : ''}`}
          aria-label={`Toggle ${ABILITY_NAMES[ability]} saving-throw proficiency`}
        />
        <span className="text-xs font-bold" style={{ color: 'var(--ink)' }}>
          Saving Throw
        </span>
        <span
          className="ml-auto text-xs font-bold"
          style={{ color: 'var(--ink-soft)' }}
        >
          {signed(saveTotal)}
        </span>
      </div>

      {/* Skills list */}
      <div className="flex-1 min-h-0 max-h-48 overflow-y-auto sheet-scroll">
        {skillsForAbility.map((sk) => {
          const st = sheet.skills[sk.key]
          const total = skillCheckTotal(
            mod,
            prof,
            st.proficient,
            st.expertise,
            joat,
          )
          return (
            <div
              key={sk.key}
              className="flex items-center gap-1.5 px-1 py-0.5 text-[11px]"
              style={{ color: 'var(--ink)' }}
            >
              <button
                type="button"
                onClick={() => toggleSkillProficient(sk.key)}
                className={`sheet-circle ${st.proficient ? 'is-checked' : ''}`}
                aria-label={`Toggle ${sk.label} proficiency`}
              />
              <button
                type="button"
                onClick={() => toggleSkillExpertise(sk.key)}
                className={`sheet-circle ${
                  st.expertise ? 'is-expertise' : ''
                } ${!st.proficient ? 'opacity-30' : ''}`}
                style={{ width: 8, height: 8 }}
                aria-label={`Toggle ${sk.label} expertise`}
                title="Expertise (doubles proficiency bonus)"
              />
              <span
                className="flex-1 truncate"
                style={{ color: 'var(--ink-soft)' }}
                title={sk.label}
              >
                {sk.label}
              </span>
              <span
                className="font-bold text-[11px]"
                style={{ color: 'var(--ink)' }}
              >
                {signed(total)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** Container rendering all six ability cards in two columns of three rows. */
export function AbilityGrid() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ABILITY_ORDER.map((a) => (
        <AbilityCard key={a} ability={a} />
      ))}
    </div>
  )
}

