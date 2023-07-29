import { type Item } from "@prisma/client";


type WeaponKey = 'dmgMin' | 'dmgMax' | 'atkSpeed'

type Weapon<T extends Item = Item> = {[K in keyof T]: K extends WeaponKey ? NonNullable<T[K]> : T[K] }

export const isWeapon = <T extends Item>(item: T): item is Weapon<T> => {
  return item.atkSpeed !== null && item.dmgMin !== null && item.dmgMax !== null
}

export const getAverageDamage = (item: Weapon) => {
  return (item.dmgMax - item.dmgMin)/2
}

export const getSumOfBasicStats = (item: Item) => {
  return ((item.agi ?? 0) + (item.str ?? 0) + (item.sta ?? 0) + (item.int ?? 0))
}