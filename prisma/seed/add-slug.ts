import { type Item, type Loot, type Mob, PrismaClient } from '@prisma/client'
import { getSlugFromName } from '~/utils/misc'

const prisma = new PrismaClient()
async function main() {

  const data = await prisma.mob.findMany()
  for(const d of data) {
    await prisma.mob.update({
      data: {
        slug: getSlugFromName(d.name),
      },
      where: {
        id: d.id
      }
    })
  }

  const item = await prisma.item.findMany()
  for(const d of item) {
    await prisma.item.update({
      data: {
        slug: getSlugFromName(d.name),
      },
      where: {
        id: d.id
      }
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