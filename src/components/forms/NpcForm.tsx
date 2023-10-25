'use client'
import { Form } from "~/components/forms/Form"
import { type Item, type Area } from "@prisma/client"
import { useToast } from "~/components/ui/use-toast"
import { useTransition } from "react"
import { npcSchema, npcTypeSchema } from "./controlled/schemas"
import { z } from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type RouterOutputs } from "~/trpc/shared"
import { useRouter } from "next/navigation"


export type NpcSchema = z.infer<typeof npcSchema>

type InputData = NonNullable<RouterOutputs['npc']['getBySlug']>
interface Props {
  areas: Pick<Area, 'id' | 'name' | 'spriteUrl' | 'height' | 'width'>[]
  items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[],
  sprites: string[],
  onSubmit: (data: NpcSchema, originalId?: string) => Promise<RouterOutputs['npc']['create']>
  initialValues?: InputData
}

const getFormDataFromData = (npc: InputData): NpcSchema => {
  return {
    items: npc.items.map(({ item, price }) => ({
      id: item.id,
      item,
      price
    })),
    locations: npc.locations.map(({ id, areaId, x, y }) => ({
      id,
      areaId,
      coordinates: { x, y }
    })),
    sprite: z.string().brand('sprite').parse(npc.spriteUrl),
    name: npc.name,
    type: npcTypeSchema.parse(npc.type)
  }
}

export default function NpcForm({ areas, items, sprites, onSubmit, initialValues }: Props) {

    const [isPending, startTransition] = useTransition()

    const vals = initialValues && getFormDataFromData(initialValues)

    const form = useForm<NpcSchema>({
      resolver: zodResolver(npcSchema),
      // values: vals,
      defaultValues: vals ?? {
        locations: [],
        items: []
      }
    });

    const { toast } = useToast()
    const router = useRouter()

    return (<Form
        schema={npcSchema}
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
          items: {
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
                router.replace(`/npcs/${response.slug}/edit`)
              } else {
                router.push(`/npcs/${response.slug}`)
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