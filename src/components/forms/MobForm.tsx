'use client'
import { Form } from "~/components/forms/Form"
import { type Item, type Area } from "@prisma/client"
import { useToast } from "~/components/ui/use-toast"
import { useTransition } from "react"
import { mobSchema } from "./controlled/schemas"
import { z } from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type RouterOutputs } from "~/utils/api"
import { useRouter } from "next/navigation"


export type MobSchema = z.infer<typeof mobSchema>

type InputData = NonNullable<RouterOutputs['mob']['getBySlug']>

interface Props {
  areas: Pick<Area, 'id' | 'name' | 'spriteUrl' | 'height' | 'width'>[]
  items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[],
  sprites: string[],
  onSubmit: (data: MobSchema, originalId?: string) => Promise<RouterOutputs['mob']['create']>
  initialValues?: InputData
}

const getFormDataFromData = (mob: InputData): MobSchema => {
  return {
    drops: mob.drops.map(({ item, dropRate }) => ({
      id: item.id,
      item,
      dropRate
    })),
    locations: mob.locations.map(({ id, areaId, x, y }) => ({
      id,
      areaId,
      coordinates: { x, y }
    })),
    sprite: z.string().brand('sprite').parse(mob.spriteUrl),
    name: mob.name,
    goldMax: mob.goldMax,
    goldMin: mob.goldMin,
    level: mob.level,
    health: mob.health,
    boss: mob.boss,
    atkSpeed: mob.atkSpeed,
    dmgMax: mob.dmgMax,
    dmgMin: mob.dmgMin
  }
}

export default function MobForm({ areas, items, sprites, onSubmit, initialValues }: Props) {

    const [isPending, startTransition] = useTransition()

    const vals = initialValues && getFormDataFromData(initialValues)

    const form = useForm<MobSchema>({
      resolver: zodResolver(mobSchema),
      // values: vals,
      defaultValues: vals ?? {
        locations: [],
        drops: [],
      }
    });

    const { toast } = useToast()
    const router = useRouter()

    return (<Form
        schema={mobSchema}
        form={form}
        formProps={{
          loading: isPending,
          dirty: form.formState.isDirty,
          button: initialValues ? 'Update' : 'Create'
        }}
        props={{
          locations: {
            areas,
          },
          drops: {
            items,
          },
          sprite: {
            options: sprites
          }
        }}
        onSubmit={v => {
          startTransition(async () => {
            const response = await onSubmit(v, initialValues?.id)
            if(response.slug !== initialValues?.slug) {
              if(initialValues) {
                router.replace(`/mobs/${response.slug}/edit`)
              } else {
                router.push(`/mobs/${response.slug}`)
              }
            }
            toast({
              title: "Success",
              description: initialValues ? 'Updated' : 'Created'
            })
            router.refresh()
          })
        }}
    />)
}