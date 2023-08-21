'use server'

import { type MobSchema } from "~/components/forms/MobForm"
import { api } from "~/utils/api"

export async function editMob(data: MobSchema, id?: string) {
  if(!id) {
    throw new Error("No ID")
  }
  const trpc = await api()
  
  return await trpc.mob.update({
    id,
    data
  })
}