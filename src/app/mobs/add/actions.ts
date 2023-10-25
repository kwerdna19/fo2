'use server'

import { type MobSchema } from "~/components/forms/MobForm"
import { api } from "~/trpc/server"

export async function addMob(data: MobSchema) {
  return api.mob.create.mutate(data)
}