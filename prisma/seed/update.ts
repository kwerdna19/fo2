import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {

  const data = await prisma.npc.findMany({
    where: {
      spriteUrl: {
        startsWith: '/sprites/npcs/'
      }
    },
    select: {
      id: true,
      spriteUrl: true,
    }
  })

  console.log('Found: ' + data.length)

  for(const n of data) {
    await prisma.npc.update({
      data: {
        spriteUrl: n.spriteUrl.replace('/sprites/npcs/', '/sprites/npc/')
      },
      where: {
        id: n.id
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