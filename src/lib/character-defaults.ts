/**
 * Default character sheet state, pre-populated with the example
 * character "Jichael Mackson" (Bard 2, Elf) extracted from the
 * filled-in PDF character sheet.
 *
 * Every field on the sheet is editable from the UI; this is just the
 * initial state so the page renders as a real character on first load.
 */

import type { AbilityKey, SkillKey, ArmorType, CoinType } from './dnd'

export interface AbilityState {
  score: number | '' // 1-30, or '' if blank
  saveProficient: boolean
}

export interface SkillState {
  proficient: boolean
  bonus: number // override bonus (0 means use ability mod + prof)
  expertise: boolean
}

export interface WeaponState {
  id: string
  name: string
  atkBonus: string // allow text like "+3" or "DC 14"
  damage: string // e.g. "1d6 Psychic DisAtt"
  notes: string
}

export interface SpellSlotState {
  total: number
  expended: number
}

export interface SpellRowState {
  id: string
  level: string // 'C' for cantrip, '1'..'9' for spell level
  name: string
  castingTime: string
  range: string
  components: { c: boolean; r: boolean; m: boolean }
  concentration: boolean
  ritual: boolean
  notes: string // short mechanical summary (e.g. "1d6 Psychic DisSa")
  description: string // full spell description (free-form text)
  iconDataUrl: string // optional uploaded icon image (base64 data URL); replaces the level badge
}

export interface CharacterSheet {
  // Identity
  characterName: string
  background: string
  class: string
  species: string
  subclass: string
  level: number | ''
  xp: number | ''

  // Armor / HP
  armorClass: string
  shield: string // armor bonus from shield
  hpTemp: string
  hpCurrent: string
  hpMax: string
  hitDiceSpent: string
  hitDiceMax: string
  deathSavesSuccesses: boolean[] // length 3
  deathSavesFailures: boolean[] // length 3

  // Stat bar — only editable base values.
  // proficiencyBonus, initiative, and passivePerception are auto-derived
  // at render time from level / DEX / WIS + perception proficiency.
  speed: string
  size: string

  // Abilities
  abilities: Record<AbilityKey, AbilityState>

  // Skills (overrides saved as bonus)
  skills: Record<SkillKey, SkillState>

  // Combat tab
  weapons: WeaponState[]

  // Long-form text
  classFeatures: string
  speciesTraits: string
  feats: string
  equipmentTrainingNotes: string
  alignment: string

  // Proficiencies
  armorTraining: Record<ArmorType, boolean>
  weaponsProficient: string
  toolsProficient: string
  languages: string
  heroicInsppiration: boolean
  jackOfAllTrades: boolean // Bard level-2 feature: adds flat +1 to non-proficient ability checks

  // Spellcasting — spellcasting ability is chosen; modifier / save DC / attack
  // bonus are all auto-derived at render time.
  spellcastingAbility: string // e.g. 'Charisma'
  spellSlots: SpellSlotState[] // length 9
  spells: SpellRowState[]
  damageCantrips: string // the "Weapons & Damage Cantrips" free text in weapons area

  // Coins
  coins: Record<CoinType, string>

  // Equipment
  equipment: string
  magicItemAttunement: string
}

let _idCounter = 0
const id = () => `id_${++_idCounter}_${Math.random().toString(36).slice(2, 8)}`

export function newId() {
  return id()
}

/**
 * The default character: Jichael Mackson, Elf Bard 2.
 * Values are pulled directly from the populated PDF.
 */
export function defaultCharacter(): CharacterSheet {
  return {
    characterName: 'Jichael Mackson',
    background: 'ENTERTAINER',
    class: 'Bard',
    species: 'ELF',
    subclass: '',
    level: 2,
    xp: 400,

    armorClass: '14',
    shield: '',
    hpTemp: '',
    hpCurrent: '20',
    hpMax: '20',
    hitDiceSpent: '0',
    hitDiceMax: '2', // 1 Hit Die per class level
    deathSavesSuccesses: [false, false, false],
    deathSavesFailures: [false, false, false],

    // NOTE: proficiencyBonus, initiative, passivePerception, spellcastingModifier,
    // spellSaveDC, and spellAttackBonus are all auto-derived at render time
    // from level / ability scores / proficiency toggles.
    speed: '30',
    size: 'M',

    abilities: {
      str: { score: 11, saveProficient: false },
      dex: { score: 10, saveProficient: false },
      con: { score: 15, saveProficient: true },
      int: { score: 10, saveProficient: false },
      wis: { score: 16, saveProficient: false },
      cha: { score: 18, saveProficient: false },
    },

    skills: {
      acrobatics: { proficient: true, bonus: 0, expertise: false },
      animalHandling: { proficient: false, bonus: 0, expertise: false },
      arcana: { proficient: false, bonus: 0, expertise: false },
      athletics: { proficient: false, bonus: 0, expertise: false },
      deception: { proficient: true, bonus: 0, expertise: false },
      history: { proficient: false, bonus: 0, expertise: false },
      insight: { proficient: false, bonus: 0, expertise: false },
      intimidation: { proficient: false, bonus: 0, expertise: false },
      investigation: { proficient: false, bonus: 0, expertise: false },
      medicine: { proficient: false, bonus: 0, expertise: false },
      nature: { proficient: false, bonus: 0, expertise: false },
      perception: { proficient: true, bonus: 0, expertise: false },
      performance: { proficient: true, bonus: 0, expertise: false },
      persuasion: { proficient: true, bonus: 0, expertise: false },
      religion: { proficient: false, bonus: 0, expertise: false },
      sleightOfHand: { proficient: true, bonus: 0, expertise: false },
      stealth: { proficient: true, bonus: 0, expertise: false },
      survival: { proficient: false, bonus: 0, expertise: false },
    },

    weapons: [
      {
        id: id(),
        name: 'Vicious Mockery (Cantrip)',
        atkBonus: '',
        damage: '1d6 Psychic DisAtt',
        notes: 'Wis save or disadv on next attack',
      },
      {
        id: id(),
        name: 'Dagger',
        atkBonus: '+5',
        damage: '1d4+3 piercing',
        notes: 'Finesse, light, thrown 20/60',
      },
      {
        id: id(),
        name: 'Shortsword',
        atkBonus: '+5',
        damage: '1d6+3 piercing',
        notes: 'Finesse, light',
      },
    ],

    classFeatures:
      'Bardic Inspiration (d6): Bonus action, range 60ft, 1 min. Use Cha mod times per long rest. ' +
      'Jack of All Trades: Half proficiency on non-proficient ability checks. ' +
      'Song of Rest: Allies heal 1d6 HP on short rest. ' +
      'B insp - +d6 on d20 uses = Cha',
    speciesTraits:
      'Darkvision 60ft.  Free Wizard cantrip.  Advantage on saving throws against being Charmed. ' +
      'Immune to magical sleep.  Can\'t be put to sleep by magic.  Skill/weapon/tool proficiency choice.',
    feats: 'Musician. As you finish a Short or Long Rest, play a song to give Heroic Inspiration ' +
      'to allies who hear it (number of allies = Proficiency Bonus).',
    equipmentTrainingNotes: '',
    alignment: 'Chaotic Good',

    armorTraining: {
      Light: true,
      Medium: true,
      Heavy: false,
      Shields: true,
    },
    weaponsProficient: 'Simple weapons, longswords, shortswords, rapiers, hand crossbows',
    toolsProficient: 'Drum, Lute, Panflute (3 instruments)',
    languages: 'Common, Elvish, Celestial, Druid',
    heroicInsppiration: true,
    jackOfAllTrades: true, // Bard level-2 class feature

    spellcastingAbility: 'Charisma',
    spellSlots: [
      { total: 3, expended: 0 }, // L1
      { total: 0, expended: 0 }, // L2
      { total: 0, expended: 0 }, // L3
      { total: 0, expended: 0 }, // L4
      { total: 0, expended: 0 }, // L5
      { total: 0, expended: 0 }, // L6
      { total: 0, expended: 0 }, // L7
      { total: 0, expended: 0 }, // L8
      { total: 0, expended: 0 }, // L9
    ],
    spells: [
      // cantrips
      {
        id: id(), level: 'C', name: 'Vicious Mockery', castingTime: '1A', range: '60 ft',
        components: { c: true, r: false, m: false }, concentration: false, ritual: false,
        notes: '1d6 Psychic · Wis save · disadv next attack',
        description:
          'You unleash a string of insults laced with subtle enchantments at a creature you can see within range. ' +
          'If the target can hear you (though it need not understand you), the target must succeed on a Wisdom saving throw ' +
          'or take 1d6 psychic damage and have disadvantage on the next attack roll it makes before the end of its next turn.\n\n' +
          'At Higher Levels. The damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).',
        iconDataUrl: '',
      },
      {
        id: id(), level: 'C', name: 'Prestidigitation', castingTime: '1A', range: '10 ft',
        components: { c: true, r: false, m: false }, concentration: false, ritual: false,
        notes: 'Minor magical effect (up to 3 active)',
        description:
          'This spell is a minor magical trick that novice spellcasters use for practice. You create one of the following magical effects within range:\n\n' +
          '• You create a harmless sensory effect, such as a shower of sparks, a gust of wind, faint musical notes, or a strong odor.\n' +
          '• You light or snuff a candle, torch, or small campfire.\n' +
          '• You chill or warm up to 1 cubic foot of nonliving material for 1 hour.\n' +
          '• You color, clean, or soil 1 cubic foot of nonliving material for 1 hour.\n' +
          '• You make a small mark or symbol appear on a surface for 1 hour.\n' +
          '• You create a small, useless trinket that lasts until the end of your next turn.\n\n' +
          'If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time.',
        iconDataUrl: '',
      },
      {
        id: id(), level: 'C', name: 'Mind Sliver', castingTime: '1A', range: '60 ft',
        components: { c: true, r: false, m: false }, concentration: false, ritual: false,
        notes: '1d6 Psychic · Int save · -1d4 next save',
        description:
          'You drive a disorienting spike of psychic energy into the mind of one creature you can see within range. ' +
          'The target must make an Intelligence saving throw. On a failed save, the target takes 1d6 psychic damage and ' +
          'subtracts 1d4 from the next saving throw it makes before the end of your next turn.\n\n' +
          'At Higher Levels. The damage increases by 1d6 when you reach 5th level (2d6), 11th level (3d6), and 17th level (4d6).',
        iconDataUrl: '',
      },
      // L1
      {
        id: id(), level: '1', name: 'Charm Person', castingTime: '1A', range: '30 ft',
        components: { c: true, r: false, m: false }, concentration: true, ritual: false,
        notes: 'Charm 1h · Wis save',
        description:
          'You attempt to charm a humanoid you can see within range. It must make a Wisdom saving throw, and does so with advantage ' +
          'if you or your companions are fighting it. On a failed save, it is charmed by you until the spell ends or until you or your ' +
          'companions do anything harmful to it. The charmed creature is friendly to you.\n\n' +
          'When the spell ends, the creature knows it was charmed by you.\n\n' +
          'At Higher Levels. You can target one additional creature for each slot level above 1st.',
        iconDataUrl: '',
      },
      {
        id: id(), level: '1', name: 'Color Spray', castingTime: '1A', range: '15 ft cone',
        components: { c: true, r: false, m: true }, concentration: false, ritual: false,
        notes: 'Blind · Con save · 6d10 HP cap',
        description:
          'You hurl a dazzling array of flashing, colorful, blinding lights in a 15-foot cone. ' +
          'Each creature in the area must make a Constitution saving throw. On a failed save, the creature is blinded for the duration.\n\n' +
          'Roll 6d10; the total is how many hit points of creatures the spell can affect. Creatures are affected in order of their ' +
          'hit points, starting with the lowest. Subtract each creature\'s hit points from the total before moving to the next.\n\n' +
          'At Higher Levels. Roll 2d10 more for each slot level above 1st.',
        iconDataUrl: '',
      },
      {
        id: id(), level: '1', name: 'Bane', castingTime: '1A', range: '30 ft (3 targets)',
        components: { c: true, r: false, m: true }, concentration: true, ritual: false,
        notes: '-1d4 to attacks & saves · Cha save',
        description:
          'Up to three creatures of your choice that you can see within range must make Charisma saving throws. On a failed save, ' +
          'the targets subtract 1d4 from attack rolls and saving throws for the duration.\n\n' +
          'A creature can be affected by only one Bane at a time.\n\n' +
          'At Higher Levels. You can target one additional creature for each slot level above 1st.',
        iconDataUrl: '',
      },
      {
        id: id(), level: '1', name: 'Cure Wounds', castingTime: '1A', range: 'Touch',
        components: { c: true, r: false, m: true }, concentration: false, ritual: false,
        notes: '1d8 + CHA healing',
        description:
          'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier. ' +
          'This spell has no effect on undead or constructs.\n\n' +
          'At Higher Levels. The healing increases by 1d8 for each slot level above 1st.',
        iconDataUrl: '',
      },
      {
        id: id(), level: '1', name: 'Sleep', castingTime: '1A', range: '90 ft',
        components: { c: true, r: false, m: true }, concentration: false, ritual: false,
        notes: '5d8 HP slumber · no save',
        description:
          'This spell sends creatures into a magical slumber. Roll 5d8; the total is how many hit points of creatures this spell can affect. ' +
          'Creatures within 20 feet of a point you choose within range are affected in order of their hit points (ignoring unconscious creatures).\n\n' +
          'Starting with the creature with the lowest hit points, each creature affected by this spell falls unconscious. Subtract each ' +
          'creature\'s hit points from the total before moving to the next. Undead and creatures immune to being charmed aren\'t affected.\n\n' +
          'At Higher Levels. Roll 2d8 more for each slot level above 1st.',
        iconDataUrl: '',
      },
    ],
    damageCantrips: '',

    coins: {
      cp: '0',
      sp: '0',
      ep: '0',
      gp: '128',
      pp: '0',
    },

    equipment:
      'Studded leather armor, 2 daggers, shortsword, drum, lute, panflute, ' +
      'entertainer\'s pack, burglar\'s pack, fine clothes, 2 trinkets',
    magicItemAttunement: '',
  }
}

/**
 * A freshly blank character sheet for the "New" button.
 */
export function blankCharacter(): CharacterSheet {
  // Properly initialize every skill to blank
  const skills = {} as Record<SkillKey, SkillState>
  ;([
    'acrobatics', 'animalHandling', 'arcana', 'athletics', 'deception', 'history',
    'insight', 'intimidation', 'investigation', 'medicine', 'nature', 'perception',
    'performance', 'persuasion', 'religion', 'sleightOfHand', 'stealth', 'survival',
  ] as SkillKey[]).forEach((k) => { skills[k] = { proficient: false, bonus: 0, expertise: false } })

  const abilities = {
    str: { score: '' as const, saveProficient: false },
    dex: { score: '' as const, saveProficient: false },
    con: { score: '' as const, saveProficient: false },
    int: { score: '' as const, saveProficient: false },
    wis: { score: '' as const, saveProficient: false },
    cha: { score: '' as const, saveProficient: false },
  }

  return {
    characterName: '',
    background: '',
    class: '',
    species: '',
    subclass: '',
    level: 1,
    xp: 0,
    armorClass: '',
    shield: '',
    hpTemp: '',
    hpCurrent: '',
    hpMax: '',
    hitDiceSpent: '0',
    hitDiceMax: '1',
    deathSavesSuccesses: [false, false, false],
    deathSavesFailures: [false, false, false],
    speed: '30',
    size: 'M',
    abilities,
    skills,
    weapons: [],
    classFeatures: '',
    speciesTraits: '',
    feats: '',
    equipmentTrainingNotes: '',
    alignment: '',
    armorTraining: { Light: false, Medium: false, Heavy: false, Shields: false },
    weaponsProficient: '',
    toolsProficient: '',
    languages: '',
    heroicInspiration: false,
    jackOfAllTrades: false,
    spellcastingAbility: '',
    spellSlots: [
      { total: 2, expended: 0 }, { total: 0, expended: 0 }, { total: 0, expended: 0 },
      { total: 0, expended: 0 }, { total: 0, expended: 0 }, { total: 0, expended: 0 },
      { total: 0, expended: 0 }, { total: 0, expended: 0 }, { total: 0, expended: 0 },
    ],
    spells: [],
    damageCantrips: '',
    coins: { cp: '', sp: '', ep: '', gp: '', pp: '' },
    equipment: '',
    magicItemAttunement: '',
  }
}
