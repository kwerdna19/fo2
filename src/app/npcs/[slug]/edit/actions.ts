'use server'

import { type NpcSchema } from "~/components/forms/NpcForm"
import { api } from "~/trpc/server"

export async function editNpc(data: NpcSchema, id?: string) {
  if(!id) {
    throw new Error("No ID")
  }
  
  return await api.npc.update.mutate({
    id,
    data
  })
}