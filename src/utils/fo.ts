import { type EquippableType, type Item } from "@prisma/client";

// not exported from prisma client yet?
export enum Slot {
  HEAD = 1,
  FACE = 2,
  BACK = 3,
  SHOULDERS = 4,
  CHEST = 5,
  LEGS = 6,
  LEFT_RING = 7,
  RIGHT_RING = 8,
  MAIN_HAND = 9,
  LEFT_TRINKET = 10,
  RIGHT_TRINKET = 11,
  GUILD = 12,
  OFFHAND = 13
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
  console.log('es', e,s)
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