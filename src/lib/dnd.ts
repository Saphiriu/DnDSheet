/**
 * DnD 5.5e (2024 revision) rule helpers.
 *
 * These functions implement the core math of the game:
 *   - Ability score → modifier
 *   - Proficiency bonus by level
 *   - Spell save DC and spell attack bonus
 *   - Passive perception
 *   - Skill check total
 *   - Initiative
 *
 * All formulas follow the 2024 Player's Handbook rules (which are mechanically
 * identical to 2014 for these calculations).
 */

export type AbilityKey =
  | 'str'
  | 'dex'
  | 'con'
  | 'int'
  | 'wis'
  | 'cha'

export const ABILITY_NAMES: Record<AbilityKey, string> = {
  str: 'STRENGTH',
  dex: 'DEXTERITY',
  con: 'CONSTITUTION',
  int: 'INTELLIGENCE',
  wis: 'WISDOM',
  cha: 'CHARISMA',
}

export const ABILITY_ORDER: AbilityKey[] = ['str', 'dex', 'con', 'int', 'wis', 'cha']

/**
 * Standard DnD ability score → modifier.
 * score 10-11 → +0, score 12-13 → +1, score 8-9 → -1, etc.
 */
export function abilityModifier(score: number): number {
  if (Number.isNaN(score) || score == null) return 0
  return Math.floor((score - 10) / 2)
}

/**
 * Proficiency bonus by character level.
 *   Levels  1–4  → +2
 *   Levels  5–8  → +3
 *   Levels  9–12 → +4
 *   Levels 13–16 → +5
 *   Levels 17–20 → +6
 */
export function proficiencyBonusByLevel(level: number): number {
  if (!level || level < 1) return 2
  if (level >= 17) return 6
  if (level >= 13) return 5
  if (level >= 9) return 4
  if (level >= 5) return 3
  return 2
}

/**
 * Format a signed modifier (e.g. +3, -1, +0).
 */
export function signed(n: number): string {
  if (Number.isNaN(n) || n == null) return '+0'
  return n >= 0 ? `+${n}` : `${n}`
}

/**
 * Spell save DC = 8 + proficiency bonus + spellcasting ability modifier.
 */
export function spellSaveDC(
  profBonus: number,
  spellcastingMod: number,
): number {
  return 8 + profBonus + spellcastingMod
}

/**
 * Spell attack bonus = proficiency bonus + spellcasting ability modifier.
 */
export function spellAttackBonus(
  profBonus: number,
  spellcastingMod: number,
): number {
  return profBonus + spellcastingMod
}

/**
 * Passive perception = 10 + wisdom modifier + (proficiency bonus if proficient in Perception).
 */
export function passivePerception(
  wisMod: number,
  profBonus: number,
  proficient: boolean,
): number {
  return 10 + wisMod + (proficient ? profBonus : 0)
}

/**
 * Skill check modifier = ability modifier + (proficiency bonus if proficient) + (additional bonus for expertise).
 *
 * Expertise doubles the proficiency bonus (Rogues and Bards at certain levels).
 * The `expertise` flag here is a simpler version: if true, proficiency bonus is doubled.
 *
 * `joat` (Jack of All Trades, Bard level 2 feature) adds a flat +1 to ability
 * checks the character is NOT proficient in (house-rule simplification; the
 * official rule is floor(profBonus / 2), but per user request we use +1 flat).
 */
export function skillCheckTotal(
  abilityMod: number,
  profBonus: number,
  proficient: boolean,
  expertise = false,
  joat = false,
): number {
  if (proficient) return abilityMod + (expertise ? profBonus * 2 : profBonus)
  if (joat) return abilityMod + jackOfAllTradesBonus()
  return abilityMod
}

/**
 * Jack of All Trades bonus — flat +1 to non-proficient ability checks.
 */
export function jackOfAllTradesBonus(): number {
  return 1
}

/**
 * Hit point maximum rolled total suggested for a class:
 * at level 1 = class hit die + CON mod;
 * at higher levels = (class hit die/2 + 1) per level + CON mod per level.
 * Used only as a hint — players can override.
 */
export function suggestedHPMax(
  level: number,
  hitDie: number,
  conMod: number,
): number {
  if (level < 1) return hitDie + conMod
  return hitDie + conMod + (level - 1) * (Math.floor(hitDie / 2) + 1 + conMod)
}

/**
 * Spell slots per level per caster level (full caster progression 2024).
 * Index 0 = level 1 character, etc. Returns [slots1, slots2, ..., slots9].
 */
const SPELL_SLOT_TABLE: number[][] = [
  // L1
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  // L2
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  // L3
  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  // L4
  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  // L5
  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  // L6
  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  // L7
  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  // L8
  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  // L9
  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  // L10
  [4, 3, 3, 3, 2, 0, 0, 0, 0],
  // L11
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  // L12
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  // L13
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  // L14
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  // L15
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  // L16
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  // L17
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  // L18
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  // L19
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  // L20
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
]

/**
 * Get suggested spell slots for a full-caster level.
 * Half-casters (Ranger, Paladin) round down and never get slots above 5.
 */
export function suggestedSpellSlots(
  level: number,
  halfCaster = false,
): number[] {
  const safeLevel = Math.max(1, Math.min(20, level || 1))
  const full = SPELL_SLOT_TABLE[safeLevel - 1] ?? [0, 0, 0, 0, 0, 0, 0, 0, 0]
  if (!halfCaster) return [...full]
  // Half-caster: effective level = ceil(level/2). No slots above 5.
  const eff = Math.ceil(safeLevel / 2)
  const half = [...(SPELL_SLOT_TABLE[eff - 1] ?? [0, 0, 0, 0, 0, 0, 0, 0, 0])]
  for (let i = 5; i < 9; i++) half[i] = 0
  return half
}

/**
 * Standard skill list mapped to ability key.
 * This is the canonical 2024 skill list, same as 2014.
 */
export type SkillKey =
  | 'acrobatics'
  | 'animalHandling'
  | 'arcana'
  | 'athletics'
  | 'deception'
  | 'history'
  | 'insight'
  | 'intimidation'
  | 'investigation'
  | 'medicine'
  | 'nature'
  | 'perception'
  | 'performance'
  | 'persuasion'
  | 'religion'
  | 'sleightOfHand'
  | 'stealth'
  | 'survival'

export const SKILLS: { key: SkillKey; label: string; ability: AbilityKey }[] = [
  { key: 'acrobatics', label: 'Acrobatics', ability: 'dex' },
  { key: 'animalHandling', label: 'Animal Handling', ability: 'wis' },
  { key: 'arcana', label: 'Arcana', ability: 'int' },
  { key: 'athletics', label: 'Athletics', ability: 'str' },
  { key: 'deception', label: 'Deception', ability: 'cha' },
  { key: 'history', label: 'History', ability: 'int' },
  { key: 'insight', label: 'Insight', ability: 'wis' },
  { key: 'intimidation', label: 'Intimidation', ability: 'cha' },
  { key: 'investigation', label: 'Investigation', ability: 'int' },
  { key: 'medicine', label: 'Medicine', ability: 'wis' },
  { key: 'nature', label: 'Nature', ability: 'int' },
  { key: 'perception', label: 'Perception', ability: 'wis' },
  { key: 'performance', label: 'Performance', ability: 'cha' },
  { key: 'persuasion', label: 'Persuasion', ability: 'cha' },
  { key: 'religion', label: 'Religion', ability: 'int' },
  { key: 'sleightOfHand', label: 'Sleight of Hand', ability: 'dex' },
  { key: 'stealth', label: 'Stealth', ability: 'dex' },
  { key: 'survival', label: 'Survival', ability: 'wis' },
]

/**
 * Saving throw names.
 */
export const SAVING_THROWS: { key: AbilityKey; label: string }[] = [
  { key: 'str', label: 'Strength' },
  { key: 'dex', label: 'Dexterity' },
  { key: 'con', label: 'Constitution' },
  { key: 'int', label: 'Intelligence' },
  { key: 'wis', label: 'Wisdom' },
  { key: 'cha', label: 'Charisma' },
]

/**
 * Armor training categories.
 */
export const ARMOR_TYPES = ['Light', 'Medium', 'Heavy', 'Shields'] as const
export type ArmorType = (typeof ARMOR_TYPES)[number]

/**
 * Coin denominations.
 */
export const COIN_TYPES = ['cp', 'sp', 'ep', 'gp', 'pp'] as const
export type CoinType = (typeof COIN_TYPES)[number]
