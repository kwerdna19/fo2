'use server'

import { type NpcSchema } from "~/components/forms/NpcForm"
import { api } from "~/utils/api"

export async function editNpc(data: NpcSchema, id?: string) {
  if(!id) {
    throw new Error("No ID")
  }
  const trpc = await api()
  
  return await trpc.npc.update({
    id,
    data
  })
}