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
  duration: string // how long the spell's effect lasts (e.g. "Instantaneous", "1 minute", "Up to 1 hour")
  components: { c: boolean; r: boolean; m: boolean }
  concentration: boolean
  ritual: boolean
  notes: string // short mechanical summary (e.g. "1d6 Psychic DisSa")
  description: string // full spell description (free-form text)
  iconDataUrl: string // optional uploaded icon image (base64 data URL); replaces the level badge
  prepared: boolean // true = prepared (memorized and castable today), false = in spellbook only
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
  notes: string // free-form campaign notes (big text area on Page 3)

  // Proficiencies
  armorTraining: Record<ArmorType, boolean>
  weaponsProficient: string
  toolsProficient: string
  languages: string
  heroicInsppiration: boolean
  jackOfAllTrades: boolean // Bard level-2 feature: adds flat +1 to non-proficient ability checks
  alertFeat: boolean // Alert feat: adds PB to initiative

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
 * The default character: Javier Escobar, Harengon Wizard (Bladesinger) 2.
 */
export function defaultCharacter(): CharacterSheet {
  return {
    characterName: 'Javier Escobar',
    background: 'West Side Dark Forest',
    class: 'Wizard',
    species: 'Harengon',
    subclass: 'Bladesinger',
    level: 2,
    xp: 700,

    armorClass: '13',
    shield: '',
    hpTemp: '',
    hpCurrent: '16',
    hpMax: '16',
    hitDiceSpent: '0',
    hitDiceMax: '2',
    deathSavesSuccesses: [false, false, false],
    deathSavesFailures: [false, false, false],

    speed: '30',
    size: 'S',

    abilities: {
      str: { score: 10, saveProficient: false },
      dex: { score: 16, saveProficient: false },
      con: { score: 14, saveProficient: false },
      int: { score: 18, saveProficient: true },
      wis: { score: 12, saveProficient: true },
      cha: { score: 12, saveProficient: false },
    },

    skills: {
      acrobatics: { proficient: true, bonus: 0, expertise: false },
      animalHandling: { proficient: false, bonus: 0, expertise: false },
      arcana: { proficient: true, bonus: 0, expertise: true },
      athletics: { proficient: false, bonus: 0, expertise: false },
      deception: { proficient: true, bonus: 0, expertise: false },
      history: { proficient: false, bonus: 0, expertise: false },
      insight: { proficient: false, bonus: 0, expertise: false },
      intimidation: { proficient: true, bonus: 0, expertise: false },
      investigation: { proficient: false, bonus: 0, expertise: false },
      medicine: { proficient: true, bonus: 0, expertise: false },
      nature: { proficient: true, bonus: 0, expertise: false },
      perception: { proficient: true, bonus: 0, expertise: false },
      performance: { proficient: false, bonus: 0, expertise: false },
      persuasion: { proficient: false, bonus: 0, expertise: false },
      religion: { proficient: false, bonus: 0, expertise: false },
      sleightOfHand: { proficient: false, bonus: 0, expertise: false },
      stealth: { proficient: false, bonus: 0, expertise: false },
      survival: { proficient: false, bonus: 0, expertise: false },
    },

    weapons: [],

    classFeatures: 'Lucky Footwork. When you fail a Dexterity saving throw, you can use your reaction to roll a d4 and add it to the save, potentially turning the failure into a success. You can\'t use this reaction if you\'re prone or your speed is 0.\n\nLuck Points. You have a number of Luck Points equal to your Proficiency Bonus and can spend the points on the benefits below. You regain your expended Luck Points when you finish a Long Rest.\n\nYou can regain some of your magical energy by studying your spellbook. When you finish a Short Rest, you can choose expended spell slots to recover. The spell slots can have a combined level equal to no more than half your Wizard level (round up), and none of the slots can be level 6 or higher. For example, if you\'re a level 4 Wizard, you can recover up to two levels’ worth of spell slots, regaining either one level 2 spell slot or two level 1 spell slots.\n\nOnce you use this feature, you can\'t do so again until you finish a Long Rest.',
    speciesTraits: '',
    feats: '',
    equipmentTrainingNotes: '',
    alignment: 'Chaotic neutral',
    notes: '',

    armorTraining: {
      Light: false,
      Medium: false,
      Heavy: false,
      Shields: false,
    },
    weaponsProficient: 'Simple',
    toolsProficient: 'Thieves tools',
    languages: 'Common, Sylvan, Thieves cant, Infernal',
    heroicInspiration: true,
    jackOfAllTrades: false,
    alertFeat: true,

    spellcastingAbility: 'Intelligence',
    spellSlots: [
      { total: 3, expended: 0 },
      { total: 0, expended: 0 }, { total: 0, expended: 0 }, { total: 0, expended: 0 },
      { total: 0, expended: 0 }, { total: 0, expended: 0 }, { total: 0, expended: 0 },
      { total: 0, expended: 0 }, { total: 0, expended: 0 },
    ],
    spells: [
      {
        id: id(), level: 'C', name: 'Prestidigitation', castingTime: 'A', range: '10 ft',
        duration: 'Up to 1 hour',
        components: { c: true, r: true, m: false },
        concentration: false, ritual: false,
        notes: 'Minor magical effect (up to 3 active)',
        description: 'You create a magical effect within range. Choose the effect from the options below. If you cast this spell multiple times, you can have up to three of its non-instantaneous effects active at a time.\n\nSensory Effect. You create an instantaneous, harmless sensory effect, such as a shower of sparks, a puff of wind, faint musical notes, or an odd odor.\n\nFire Play. You instantaneously light or snuff out a candle, a torch, or a small campfire.\n\nClean or Soil. You instantaneously clean or soil an object no larger than 1 cubic foot.\n\nMinor Sensation. You chill, warm, or flavor up to 1 cubic foot of nonliving material for 1 hour.\n\nMagic Mark. You make a color, a small mark, or a symbol appear on an object or a surface for 1 hour.\n\nMinor Creation. You create a nonmagical trinket or an illusory image that can fit in your hand. It lasts until the end of your next turn. A trinket can deal no damage and has no monetary worth.',
        iconDataUrl: '',
        prepared: true,
      },
      {
        id: id(), level: 'C', name: 'Blade Ward', castingTime: 'A', range: '0',
        duration: '1 min',
        components: { c: true, r: true, m: false },
        concentration: true, ritual: false,
        notes: '-1d4 for enemy attack',
        description: 'Whenever a creature makes an attack roll against you before the spell ends, the attacker subtracts 1d4 from the attack roll.',
        iconDataUrl: '',
        prepared: true,
      },
      {
        id: id(), level: 'C', name: 'Message', castingTime: 'A', range: '120 ft',
        duration: '0',
        components: { c: false, r: false, m: false },
        concentration: false, ritual: false,
        notes: '',
        description: 'You point toward a creature within range and whisper a message. The target (and only the target) hears the message and can reply in a whisper that only you can hear.\n\nYou can cast this spell through solid objects if you are familiar with the target and know it is beyond the barrier. Magical silence; 1 foot of stone, metal, or wood; or a thin sheet of lead blocks the spell.',
        iconDataUrl: '',
        prepared: false,
      },
      {
        id: id(), level: 'C', name: 'True Strike', castingTime: 'A', range: '0',
        duration: '0',
        components: { c: false, r: true, m: true },
        concentration: false, ritual: false,
        notes: 'SM as attack and DMG',
        description: 'Guided by a flash of magical insight, you make one attack with the weapon used in the spell’s casting. The attack uses your spellcasting ability for the attack and damage rolls instead of using Strength or Dexterity. If the attack deals damage, it can be Radiant damage or the weapon’s normal damage type (your choice).\n\nCantrip Upgrade. Whether you deal Radiant damage or the weapon’s normal damage type, the attack deals extra Radiant damage when you reach levels 5 (1d6), 11 (2d6), and 17 (3d6).',
        iconDataUrl: '',
        prepared: true,
      },
      {
        id: id(), level: '1', name: 'Mage Armor', castingTime: 'A', range: 'T',
        duration: '8h',
        components: { c: true, r: true, m: true },
        concentration: false, ritual: false,
        notes: 'AC 13+dex',
        description: 'You touch a willing creature who isn’t wearing armor. Until the spell ends, the target’s base AC becomes 13 plus its Dexterity modifier. The spell ends early if the target dons armor.',
        iconDataUrl: '',
        prepared: true,
      },
      {
        id: id(), level: '1', name: 'Identify', castingTime: '1min', range: 'T',
        duration: '0',
        components: { c: false, r: false, m: false },
        concentration: false, ritual: true,
        notes: '',
        description: 'You touch an object throughout the spell’s casting. If the object is a magic item or some other magical object, you learn its properties and how to use them, whether it requires Attunement, and how many charges it has, if any. You learn whether any ongoing spells are affecting the item and what they are. If the item was created by a spell, you learn that spell’s name.\n\nIf you instead touch a creature throughout the casting, you learn which ongoing spells, if any, are currently affecting it.',
        iconDataUrl: '',
        prepared: false,
      },
      {
        id: id(), level: '1', name: 'Find Familiar', castingTime: '1h', range: '10 ft',
        duration: '',
        components: { c: true, r: true, m: true },
        concentration: false, ritual: true,
        notes: '',
        description: 'You gain the service of a familiar, a spirit that takes an animal form you choose: Bat, Cat, Frog, Hawk, Lizard, Octopus, Owl, Rat, Raven, Spider, Weasel, or another Beast that has a Challenge Rating of 0. Appearing in an unoccupied space within range, the familiar has the statistics of the chosen form (see appendix B), though it is a Celestial, Fey, or Fiend (your choice) instead of a Beast. Your familiar acts independently of you, but it obeys your commands.\n\nTelepathic Connection. While your familiar is within 100 feet of you, you can communicate with it telepathically. Additionally, as a Bonus Action, you can see through the familiar’s eyes and hear what it hears until the start of your next turn, gaining the benefits of any special senses it has.\n\nFinally, when you cast a spell with a range of touch, your familiar can deliver the touch. Your familiar must be within 100 feet of you, and it must take a Reaction to deliver the touch when you cast the spell.\n\nCombat. The familiar is an ally to you and your allies. It rolls its own Initiative and acts on its own turn. A familiar can’t attack, but it can take other actions as normal.\n\nDisappearance of the Familiar. When the familiar drops to 0 Hit Points, it disappears. It reappears after you cast this spell again. As a Magic action, you can temporarily dismiss the familiar to a pocket dimension. Alternatively, you can dismiss it forever. As a Magic action while it is temporarily dismissed, you can cause it to reappear in an unoccupied space within 30 feet of you. Whenever the familiar drops to 0 Hit Points or disappears into the pocket dimension, it leaves behind in its space anything it was wearing or carrying.\n\nOne Familiar Only. You can’t have more than one familiar at a time. If you cast this spell while you have a familiar, you instead cause it to adopt a new eligible form.\n\n',
        iconDataUrl: '',
        prepared: false,
      },
      {
        id: id(), level: '1', name: 'Alarm', castingTime: '1min', range: '30ft',
        duration: '8h',
        components: { c: false, r: false, m: false },
        concentration: false, ritual: true,
        notes: '',
        description: 'You set an alarm against intrusion. Choose a door, a window, or an area within range that is no larger than a 20-foot Cube. Until the spell ends, an alarm alerts you whenever a creature touches or enters the warded area. When you cast the spell, you can designate creatures that won’t set off the alarm. You also choose whether the alarm is audible or mental:\n\nAudible Alarm. The alarm produces the sound of a handbell for 10 seconds within 60 feet of the warded area.\n\nMental Alarm. You are alerted by a mental ping if you are within 1 mile of the warded area. This ping awakens you if you’re asleep.',
        iconDataUrl: '',
        prepared: false,
      },
      {
        id: id(), level: '1', name: 'Comprehend Languages', castingTime: 'A', range: 'S',
        duration: '1h',
        components: { c: false, r: false, m: false },
        concentration: false, ritual: true,
        notes: '',
        description: 'For the duration, you understand the literal meaning of any language that you hear or see signed. You also understand any written language that you see, but you must be touching the surface on which the words are written. It takes about 1 minute to read one page of text. This spell doesn\'t decode symbols or secret messages.',
        iconDataUrl: '',
        prepared: false,
      },
      {
        id: id(), level: '1', name: 'Detect Magic', castingTime: 'A', range: 'S',
        duration: '10 min',
        components: { c: true, r: true, m: false },
        concentration: true, ritual: true,
        notes: '',
        description: 'For the duration, you sense the presence of magical effects within 30 feet of yourself. If you sense such effects, you can take the Magic action to see a faint aura around any visible creature or object in the area that bears the magic, and if an effect was created by a spell, you learn the spell\'s school of magic.\n\nThe spell is blocked by 1 foot of stone, dirt, or wood; 1 inch of metal; or a thin sheet of lead',
        iconDataUrl: '',
        prepared: false,
      },
      {
        id: id(), level: '1', name: 'Disguise Self', castingTime: '', range: 'S',
        duration: '1h',
        components: { c: false, r: false, m: false },
        concentration: false, ritual: false,
        notes: '',
        description: 'You make yourself - including your clothing, armor, weapons, and other belongings on your person - look different until the spell ends. You can seem 1 foot shorter or taller and can appear heavier or lighter. You must adopt a form that has the same basic arrangement of limbs as you have. Otherwise, the extent of the illusion is up to you.\n\nThe changes wrought by this spell fail to hold up to physical inspection. For example, if you use this spell to add a hat to your outfit, objects pass through the hat, and anyone who touches it would feel nothing.\n\nTo discern that you are disguised, a creature must take the Study action to inspect your appearance and succeed on an Intelligence (Investigation) check against your spell save DC.\n\n',
        iconDataUrl: '',
        prepared: true,
      },
      {
        id: id(), level: '1', name: 'Shield', castingTime: 'R', range: 'S',
        duration: '1r',
        components: { c: false, r: false, m: false },
        concentration: false, ritual: false,
        notes: '+5 AC',
        description: 'An imperceptible barrier of magical force protects you. Until the start of your next turn, you have a +5 bonus to AC, including against the triggering attack, and you take no damage from Magic Missile.',
        iconDataUrl: '',
        prepared: true,
      },
      {
        id: id(), level: '1', name: 'Spellfire Flare', castingTime: 'A', range: '60ft',
        duration: 'I',
        components: { c: true, r: true, m: false },
        concentration: false, ritual: false,
        notes: '2d10 radiant dmg anti cover',
        description: 'You unleash a blast of brilliant fire. Make a ranged spell attack against a target within range; a target gains no benefit from Half Cover or Three-Quarters Cover for this attack roll. On a hit, the target takes 2d10 Radiant damage.\n\nUsing a Higher-Level Spell Slot. You create an additional blast for each spell slot level above 1. You can direct the blasts at the same target or at different ones. Make a separate attack roll for each blast.',
        iconDataUrl: '',
        prepared: true,
      },
      {
        id: id(), level: '1', name: 'Frost Nova', castingTime: 'A', range: 'S',
        duration: 'I',
        components: { c: true, r: true, m: false },
        concentration: false, ritual: false,
        notes: '2d6 and restrained explosion',
        description: 'You unleash a burst of frost, creating a 15-foot Emanation originating from you. Each creature of your choice in the Emanation makes a Constitution saving throw. On a failed save, a creature takes 2d6 Cold damage, and it has the Restrained condition until the end of your next turn. On a successful save, the creature takes half as much damage only.\n\nUsing a Higher-Level Spell Slot. The damage increases by 1d6 for each spell slot level above 1.',
        iconDataUrl: '',
        prepared: true,
      },
    ],
    damageCantrips: '',

    coins: {
      cp: '0',
      sp: '0',
      gp: '80',
      pp: '0',
    },

    equipment: 'l crossbow',
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
    notes: '',
    armorTraining: { Light: false, Medium: false, Heavy: false, Shields: false },
    weaponsProficient: '',
    toolsProficient: '',
    languages: '',
    heroicInspiration: false,
    jackOfAllTrades: false,
    alertFeat: false,
    spellcastingAbility: '',
    spellSlots: [
      { total: 2, expended: 0 }, { total: 0, expended: 0 }, { total: 0, expended: 0 },
      { total: 0, expended: 0 }, { total: 0, expended: 0 }, { total: 0, expended: 0 },
      { total: 0, expended: 0 }, { total: 0, expended: 0 }, { total: 0, expended: 0 },
    ],
    spells: [],
    damageCantrips: '',
    coins: { cp: '', sp: '', gp: '', pp: '' },
    equipment: '',
    magicItemAttunement: '',
  }
}
