import { EquippableType, type Item } from "@prisma/client";

// not exported from prisma client yet?
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

export const equipmentSlotConfig: Record<EquippableType, Slot | Slot[]> = {
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

type WeaponKey = 'dmgMin' | 'dmgMax' | 'atkSpeed'
type Weapon<T extends Item = Item> = {[K in keyof T]: K extends WeaponKey ? NonNullable<T[K]> : T[K] }

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

// input arr of items, return build, items that can go in 2 slots, 1 will be picked to be in both slots right now
// FOR NOW: items input should have elements unique by slot
export const getBuildFromItems = (items: Item[]): Build => {
  return items.reduce((acc, item) => {
    if(!item.equip) {
      return acc
    }
    const slot = equipmentSlotConfig[item.equip]
    if(Array.isArray(slot)) {
      slot.forEach(s => {
        acc[s] = item
      })
      return acc
    }
    acc[slot] = item
    return acc
  }, {} as Build)
}

const equipTypeWorksForSlot = (e: EquippableType | null, s: Slot) => {
  if(!e) {
    return false
  }
  const slotOrSlots = equipmentSlotConfig[e]
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
  Slot.OFFHAND,
  Slot.GUILD,
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
    const possibleItems = items.filter(i => equipTypeWorksForSlot(i.equip, s))
    acc[s] = possibleItems.length > 0 ? possibleItems : null
    return acc
  }, {} as PossibleBuild)
}

export const LEVEL_CAP = 16;
export const STAT_POINTS_PER_LEVEL = 2;
export const BASE_BASIC_STAT = 20;