'use server'

import { type NpcSchema } from "~/components/forms/NpcForm"
import { api } from "~/trpc/server"

export async function addNpc(data: NpcSchema) {
  return await api.npc.create.mutate(data)
}