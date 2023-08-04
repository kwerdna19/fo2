'use client'
import { Form, spriteSelectSchema } from "~/components/forms/Form"
import { type Item, type Area } from "@prisma/client"
import { useToast } from "~/components/ui/use-toast"
import { useTransition } from "react"
import { type RouterInputs, type RouterOutputs } from "~/utils/api"
import { locationsSchema, nameSchema, npcTypeSchema, saleItemsSchema } from "./controlled/schemas"
import { z } from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


const createNpcSchema = z.object({
  name: nameSchema,
  type: npcTypeSchema,
  sprite: spriteSelectSchema,
  locations: locationsSchema,
  items: saleItemsSchema,
})

interface Props {
  areas: Pick<Area, 'id' | 'name' | 'spriteUrl' | 'height' | 'width'>[]
  items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[],
  sprites: string[],
  onSubmit: (data: RouterInputs['npc']['create']) => Promise<RouterOutputs['npc']['create']>
}
 
export default function NpcForm({ areas, items, sprites, onSubmit }: Props) {

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof createNpcSchema>>({
      resolver: zodResolver(createNpcSchema),
      reValidateMode: "onSubmit"
    });

    const { toast } = useToast()

    return (<Form
        schema={createNpcSchema}
        form={form}
        formProps={{
          loading: isPending
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
        defaultValues={{
          locations: [],
          items: [],
          sprite: '',
          name: '',
          type: 'Quest'
        }}
        onSubmit={v => {
          startTransition(async () => {
            console.log('submitting', v)
            const result = await onSubmit(v)
            toast({
              title: "Success",
              description: `Created ${result.name}`
            })
            form.reset()
          })
        }}
    />)
}