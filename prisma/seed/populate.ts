import { type Item, type Loot, type Mob, PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'

const prisma = new PrismaClient()
async function main() {

  const mobs = (JSON.parse(readFileSync('./prisma/seed/backup/mobs.json', { encoding: 'utf-8' }))) as Mob[]
  for(const data of mobs) {
    await prisma.mob.create({
      data
    })
  }

  const items = (JSON.parse(readFileSync('./prisma/seed/backup/items.json', { encoding: 'utf-8' }))) as Item[]
  for(const data of items) {
    await prisma.item.create({
      data
    })
  }

  const loots = (JSON.parse(readFileSync('./prisma/seed/backup/loots.json', { encoding: 'utf-8' }))) as Loot[]
  for(const data of loots) {
    await prisma.loot.create({
      data
    })
  }


}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })