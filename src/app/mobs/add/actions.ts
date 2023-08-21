'use server'

import { type MobSchema } from "~/components/forms/MobForm"
import { api } from "~/utils/api"

export async function addMob(data: MobSchema) {
  const trpc = await api()
  return trpc.mob.create(data)
}