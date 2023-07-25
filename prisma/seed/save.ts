import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'

const prisma = new PrismaClient()
async function main() {

  const tables = ['mob', 'item', 'loot']  as const

  for(const table of tables) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-unsafe-assignment
    const data = await prisma[table].findMany()
    writeFileSync(`./prisma/seed/backup/${table}s.json`, JSON.stringify(data, null, 2))
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