import { EquippableType, type Item } from "@prisma/client";

// not exported form prisma, bc unused in schemas, so moved here
export enum Slot {
  HEAD,
  FACE,
  BACK,
  SHOULDERS,
  CHEST,
  LEGS,
  LEFT_RING,
  RIGHT_RING,
  MAIN_HAND,
  LEFT_TRINKET,
  RIGHT_TRINKET,
  GUILD,
  OFFHAND
}

export type CosmeticEquippableType = typeof EquippableType.COSMETIC_HEAD |
typeof EquippableType.COSMETIC_FACE |
typeof EquippableType.COSMETIC_BACK |
typeof EquippableType.COSMETIC_SHOULDERS |
typeof EquippableType.COSMETIC_CHEST |
typeof EquippableType.COSMETIC_LEGS

export type NonCosmeticEquippableType = Exclude<EquippableType, CosmeticEquippableType>

export const equipmentSlotConfig: Record<NonCosmeticEquippableType, Slot | Slot[]> = {
  HEAD: Slot.HEAD,
  FACE: Slot.FACE,
  BACK: Slot.BACK,
  SHOULDERS: Slot.SHOULDERS,
  CHEST: Slot.CHEST,
  LEGS: Slot.LEGS,
  RING: [Slot.LEFT_RING, Slot.RIGHT_RING],
  MAIN_HAND: Slot.MAIN_HAND,
  TRINKET: [Slot.LEFT_TRINKET, Slot.RIGHT_TRINKET],
  OFFHAND: Slot.OFFHAND,
  GUILD: Slot.GUILD,
}

export const visibleEquipment = [
  EquippableType.HEAD,
  EquippableType.FACE,
  EquippableType.BACK,
  EquippableType.SHOULDERS,
  EquippableType.CHEST,
  EquippableType.LEGS,
  EquippableType.MAIN_HAND,
  EquippableType.OFFHAND
] as const

type DamageKey = 'dmgMin' | 'dmgMax' | 'atkSpeed'
type Weapon<T extends Item = Item> = {[K in keyof T]: K extends DamageKey ? NonNullable<T[K]> : T[K] }

export type Build = Partial<Record<Slot, Item>>

// value is array since the slot can be multiple things, or value is null if slot can be anything
export type PossibleBuild = Partial<Record<Slot, Item[] | null>>

export const isWeapon = <T extends Item>(item: T): item is Weapon<T> => {
  return item.atkSpeed !== null && item.dmgMin !== null && item.dmgMax !== null
}

export const getAverageDamage = (item: Weapon) => {
  return (item.dmgMax - item.dmgMin)/2
}

export const getSumOfBasicStats = (item: Item) => {
  return ((item.agi ?? 0) + (item.str ?? 0) + (item.sta ?? 0) + (item.int ?? 0))
}

const equipTypeWorksForSlot = (e: EquippableType | null, s: Slot) => {
  if(!e || e.startsWith('COSMETIC_')) {
    return false
  }
  const slotOrSlots = equipmentSlotConfig[e as NonCosmeticEquippableType]
  if(Array.isArray(slotOrSlots)) {
    return slotOrSlots.includes(s)
  }
  return slotOrSlots === s
}

export const playerSlots = [
  Slot.HEAD,
  Slot.FACE,
  Slot.BACK,
  Slot.SHOULDERS,
  Slot.CHEST,
  Slot.LEGS,
  Slot.MAIN_HAND,
  Slot.LEFT_RING,
  Slot.RIGHT_RING,
  Slot.LEFT_TRINKET,
  Slot.RIGHT_TRINKET,
  null, // empty slot for blank space in display
  Slot.GUILD,
  Slot.OFFHAND,
]

export const slotBackgroundSpriteMap: Record<Slot, string> = {
  [Slot.HEAD]: '/sprites/item-bg/item-bg-head-icon.png',
  [Slot.FACE]: '/sprites/item-bg/item-bg-face-icon.png',
  [Slot.BACK]: '/sprites/item-bg/item-bg-back-icon.png',
  [Slot.SHOULDERS]: '/sprites/item-bg/item-bg-shoulder-icon.png',
  [Slot.CHEST]: '/sprites/item-bg/item-bg-body-icon.png',
  [Slot.LEGS]: '/sprites/item-bg/item-bg-leg-icon.png',
  [Slot.LEFT_RING]: '/sprites/item-bg/item-bg-ring1-icon.png',
  [Slot.RIGHT_RING]: '/sprites/item-bg/item-bg-ring1-icon.png',
  [Slot.MAIN_HAND]: '/sprites/item-bg/item-bg-weapon-icon.png',
  [Slot.LEFT_TRINKET]: '/sprites/item-bg/item-bg-trinket1-icon.png',
  [Slot.RIGHT_TRINKET]: '/sprites/item-bg/item-bg-trinket1-icon.png',
  [Slot.GUILD]: '/sprites/item-bg/item-bg-guild-icon.png',
  [Slot.OFFHAND]: '/sprites/item-bg/item-bg-offhand-icon.png',
} 

export const getPossibleBuildFromItems = (items: Item[]): PossibleBuild => {

  return playerSlots.reduce((acc, s) => {
    if(s === null) {
      return acc
    }
    const possibleItems = items.filter(i => equipTypeWorksForSlot(i.equip, s))
    acc[s] = possibleItems.length > 0 ? possibleItems : null
    return acc
  }, {} as PossibleBuild)
}

export const LEVEL_CAP = 16;
export const STAT_POINTS_PER_LEVEL = 2;
export const BASE_BASIC_STAT = 20;




// --- stats

export type BasicStats = 'str' | 'agi' | 'sta' | 'int' | 'armor'
export type DerivedStats = 'crit' | 'dodge' | 'atkPower' | 'armor' | 'health' | 'energy'

export type PlayerStats = Record<BasicStats | DerivedStats | DamageKey, number>

export const BASE_STATS: Record<BasicStats, number> = {
  agi: 20,
  int: 20,
  sta: 20,
  str: 20,
  armor: 0
}


export const getStatPoints = (level: number | 'max') => {
  return (level === 'max' ? LEVEL_CAP : level)*STAT_POINTS_PER_LEVEL
} 


type BaseInputStats = Partial<Record<BasicStats, number | null>>

export const combineBasicStats = (...inputs: (BaseInputStats | BaseInputStats[])[]) => {

  return inputs.reduce<Record<BasicStats, number>>((acc, input) => {

    const stats = Array.isArray(input) ? input : [input]

    stats.forEach((val) => {

      if(acc.agi === undefined || acc.agi === null) {
        acc.agi = (val.agi ?? 0)
      } else {
        acc.agi += (val.agi ?? 0)
      }
  
      if(acc.str === undefined || acc.str === null) {
        acc.str = (val.str ?? 0)
      } else {
        acc.str += (val.str ?? 0)
      }
  
      if(acc.sta === undefined || acc.sta === null) {
        acc.sta = (val.sta ?? 0)
      } else {
        acc.sta += (val.sta ?? 0)
      }
  
      if(acc.int === undefined || acc.int === null) {
        acc.int = (val.int ?? 0)
      } else {
        acc.int += (val.int ?? 0)
      }

      if(acc.armor === undefined || acc.armor === null) {
        acc.armor = (val.armor ?? 0)
      } else {
        acc.armor += (val.armor ?? 0)
      }

    })


    return acc

  }, {
    agi: 0,
    int: 0,
    str: 0,
    sta: 0,
    armor: 0
  } as Record<BasicStats, number>)
}

export const getAttackPower = (stats: Record<BasicStats, number>) => {
  const maxStat = Math.max(stats.agi, stats.int, stats.sta, stats.str)
  return Math.floor(2*maxStat + stats.str - 20)
}

const BASE_ATTACK_POWER = getAttackPower(BASE_STATS) // 40


export const getCrit = (stats: Record<BasicStats, number>) => {
  return (50 + stats.agi + stats.int) / 14
}

export const getDodge = (stats: Record<BasicStats, number>) => {
  return 0.25*stats.agi
}

const fistWeapon = {
  dmgMin: 9,
  dmgMax: 14,
  atkSpeed: 1.4
}

export const getDamageRange = (stats: Record<BasicStats, number>, weapon: Pick<Weapon, 'atkSpeed' | 'dmgMax' | 'dmgMin'>) => {
  
  const atkPower = getAttackPower(stats)
  const power = (weapon.atkSpeed*(atkPower - BASE_ATTACK_POWER)/14)
  const min = Math.floor(weapon.dmgMin + power)
  const max = Math.floor(weapon.dmgMax + power)

  return [min, max] as const
}

const ENERGY_PER_LEVEL = 20
const ENERGY_PER_INT = 15

const HEALTH_PER_LEVEL = 18
const HEALTH_PER_STA = 18


export const getMaxEnergy = (stats: Record<BasicStats, number>, level: number) => {
  return (stats.int - 20)*ENERGY_PER_INT + (level*ENERGY_PER_LEVEL)
}

export const getMaxHealth = (stats: Record<BasicStats, number>, level: number) => {
  return (stats.sta - 20)*HEALTH_PER_STA + (level*HEALTH_PER_LEVEL)
}

export const getDerivedStats = (
  stats: Record<BasicStats, number>,
  level: number,
  weapon: Pick<Weapon, 'atkSpeed' | 'dmgMax' | 'dmgMin'> = fistWeapon,
): Record<DerivedStats | DamageKey, number> => {

  const [dmgMin, dmgMax] = getDamageRange(stats, weapon)

  return {
    atkPower: getAttackPower(stats),
    crit: getCrit(stats),
    dodge: getDodge(stats),
    dmgMin,
    dmgMax,
    atkSpeed: weapon.atkSpeed,
    armor: stats.armor + getArmor(stats),
    energy: getMaxEnergy(stats, level),
    health: getMaxHealth(stats, level)
  }
}

export const getArmor = (stats: Record<BasicStats, number>) => {
  return (5 * stats.str) - 100
}


export const getAllStats = (
  build: Build,
  level: number,
  skillPointAssignment: Omit<BaseInputStats, 'armor'> = {},
) => {

  const buildItems = Object.values(build).filter(Boolean)
  const basicStats = combineBasicStats(BASE_STATS, buildItems, skillPointAssignment)
  
  const mainHand = build[Slot.MAIN_HAND]
  const derivedStats = getDerivedStats(basicStats, level, mainHand && isWeapon(mainHand) ? mainHand : undefined)

  return {
    ...basicStats,
    ...derivedStats,
  }
  
}