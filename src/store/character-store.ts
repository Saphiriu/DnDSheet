/**
 * Zustand store for the interactive character sheet.
 *
 * Holds the full CharacterSheet state. Auto-persists to localStorage so
 * refresh keeps your edits.
 *
 * Derived stats (proficiency bonus, initiative, passive perception,
 * spellcasting modifier, spell save DC, spell attack bonus, skill totals)
 * are NOT stored — they are computed at render time from base values
 * using the helpers in src/lib/dnd.ts.
 */

'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  CharacterSheet,
  defaultCharacter,
  blankCharacter,
  newId,
} from '@/lib/character-defaults'
import {
  type AbilityKey,
  type SkillKey,
  type ArmorType,
  type CoinType,
} from '@/lib/dnd'

interface CharacterStore {
  sheet: CharacterSheet
  savedCharId: string | null

  // Sheet-level operations
  setSheet: (s: CharacterSheet) => void
  resetDefault: () => void
  newBlank: () => void
  clearAll: () => void

  // Generic field updater
  setField: <K extends keyof CharacterSheet>(key: K, value: CharacterSheet[K]) => void

  // Ability operations
  setAbilityScore: (k: AbilityKey, score: number | '') => void
  toggleAbilitySaveProficient: (k: AbilityKey) => void

  // Skill operations
  toggleSkillProficient: (k: SkillKey) => void
  toggleSkillExpertise: (k: SkillKey) => void
  setSkillBonus: (k: SkillKey, v: number) => void

  // Weapons
  addWeapon: () => void
  updateWeapon: (id: string, patch: Partial<CharacterSheet['weapons'][number]>) => void
  removeWeapon: (id: string) => void

  // Spells
  addSpell: () => void
  updateSpell: (id: string, patch: Partial<CharacterSheet['spells'][number]>) => void
  removeSpell: (id: string) => void

  // Spell slots
  setSpellSlotTotal: (level: number, total: number) => void
  toggleSpellSlotExpended: (level: number, idx: number) => void

  // Death saves
  toggleDeathSave: (kind: 'success' | 'failure', idx: number) => void

  // Armor / proficiencies
  toggleArmorTraining: (t: ArmorType) => void

  // Heroic inspiration + Jack of All Trades
  toggleHeroicInspiration: () => void
  toggleJackOfAllTrades: () => void

  // Coins
  setCoin: (k: CoinType, v: string) => void

  // Save/Load with API
  setSavedId: (id: string | null) => void
}

function mutate<K extends keyof CharacterSheet>(
  state: { sheet: CharacterSheet },
  key: K,
  value: CharacterSheet[K],
): CharacterSheet {
  return { ...state.sheet, [key]: value }
}

export const useCharacter = create<CharacterStore>()(
  persist(
    (set) => ({
      sheet: defaultCharacter(),
      savedCharId: null,

      setSheet: (s) => set({ sheet: s }),

      resetDefault: () => set({ sheet: defaultCharacter(), savedCharId: null }),

      newBlank: () => set({ sheet: blankCharacter(), savedCharId: null }),

      clearAll: () => {
        const fresh = blankCharacter()
        set({ sheet: fresh, savedCharId: null })
      },

      setField: (key, value) =>
        set((state) => ({ sheet: mutate(state, key, value) })),

      setAbilityScore: (k, score) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            abilities: {
              ...state.sheet.abilities,
              [k]: { ...state.sheet.abilities[k], score },
            },
          },
        })),

      toggleAbilitySaveProficient: (k) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            abilities: {
              ...state.sheet.abilities,
              [k]: {
                ...state.sheet.abilities[k],
                saveProficient: !state.sheet.abilities[k].saveProficient,
              },
            },
          },
        })),

      toggleSkillProficient: (k) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            skills: {
              ...state.sheet.skills,
              [k]: {
                ...state.sheet.skills[k],
                proficient: !state.sheet.skills[k].proficient,
              },
            },
          },
        })),

      toggleSkillExpertise: (k) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            skills: {
              ...state.sheet.skills,
              [k]: {
                ...state.sheet.skills[k],
                expertise: !state.sheet.skills[k].expertise,
              },
            },
          },
        })),

      setSkillBonus: (k, v) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            skills: {
              ...state.sheet.skills,
              [k]: { ...state.sheet.skills[k], bonus: v },
            },
          },
        })),

      addWeapon: () =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            weapons: [
              ...state.sheet.weapons,
              { id: newId(), name: '', atkBonus: '', damage: '', notes: '' },
            ],
          },
        })),

      updateWeapon: (id, patch) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            weapons: state.sheet.weapons.map((w) =>
              w.id === id ? { ...w, ...patch } : w
            ),
          },
        })),

      removeWeapon: (id) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            weapons: state.sheet.weapons.filter((w) => w.id !== id),
          },
        })),

      addSpell: () =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            spells: [
              ...state.sheet.spells,
              {
                id: newId(),
                level: '1',
                name: '',
                castingTime: '',
                range: '',
                components: { c: false, r: false, m: false },
                concentration: false,
                ritual: false,
                notes: '',
                description: '',
                iconDataUrl: '',
              },
            ],
          },
        })),

      updateSpell: (id, patch) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            spells: state.sheet.spells.map((s) =>
              s.id === id ? { ...s, ...patch } : s
            ),
          },
        })),

      removeSpell: (id) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            spells: state.sheet.spells.filter((s) => s.id !== id),
          },
        })),

      setSpellSlotTotal: (level, total) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            spellSlots: state.sheet.spellSlots.map((slot, idx) =>
              idx === level - 1 ? { ...slot, total, expended: Math.min(slot.expended, total) } : slot
            ),
          },
        })),

      toggleSpellSlotExpended: (level, idx) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            spellSlots: state.sheet.spellSlots.map((slot, idx2) => {
              if (idx2 !== level - 1) return slot
              const arr = Array.from({ length: slot.total }, (_, i) =>
                i < slot.expended
              )
              arr[idx] = !arr[idx]
              const newExpended = arr.filter(Boolean).length
              return { ...slot, expended: newExpended }
            }),
          },
        })),

      toggleDeathSave: (kind, idx) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            deathSavesSuccesses:
              kind === 'success'
                ? state.sheet.deathSavesSuccesses.map((v, i) =>
                    i === idx ? !v : v
                  )
                : state.sheet.deathSavesSuccesses,
            deathSavesFailures:
              kind === 'failure'
                ? state.sheet.deathSavesFailures.map((v, i) =>
                    i === idx ? !v : v
                  )
                : state.sheet.deathSavesFailures,
          },
        })),

      toggleArmorTraining: (t) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            armorTraining: {
              ...state.sheet.armorTraining,
              [t]: !state.sheet.armorTraining[t],
            },
          },
        })),

      toggleHeroicInspiration: () =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            heroicInspiration: !state.sheet.heroicInspiration,
          },
        })),

      toggleJackOfAllTrades: () =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            jackOfAllTrades: !state.sheet.jackOfAllTrades,
          },
        })),

      setCoin: (k, v) =>
        set((state) => ({
          sheet: {
            ...state.sheet,
            coins: { ...state.sheet.coins, [k]: v },
          },
        })),

      setSavedId: (id) => set({ savedCharId: id }),
    }),
    {
      name: 'dnd-character-sheet-v7',
      partialize: (s) => ({ sheet: s.sheet, savedCharId: s.savedCharId }),
    }
  )
)
