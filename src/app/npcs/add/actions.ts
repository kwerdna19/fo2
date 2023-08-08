'use server'

import { type NpcSchema } from "~/components/forms/NpcForm"
import { api } from "~/utils/api"

export async function addNpc(data: NpcSchema) {
  const trpc = await api()
  return trpc.npc.create(data)
}