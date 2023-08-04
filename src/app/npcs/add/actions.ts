'use server'

import { type RouterInputs, api } from "~/utils/api"


export async function addNpc(data: RouterInputs['npc']['create']) {
  const trpc = await api()
  return trpc.npc.create(data)
}