'use server'

import { type MobSchema } from "~/components/forms/MobForm"
import { api } from "~/trpc/server"

export async function editMob(data: MobSchema, id?: string) {
  if(!id) {
    throw new Error("No ID")
  }
  
  return await api.mob.update.mutate({
    id,
    data
  })
}