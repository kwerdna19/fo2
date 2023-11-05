'use client'
import { Form } from "~/components/forms/Form"
import { type Item, type Area } from "@prisma/client"
import { useToast } from "~/components/ui/use-toast"
import { mobSchema } from "./controlled/schemas"
import { z } from "zod"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from "next/navigation"
import { type RouterOutputs } from "~/trpc/shared"
import { api } from "~/trpc/react"


export type MobSchema = z.infer<typeof mobSchema>

type InputData = NonNullable<RouterOutputs['mob']['getBySlug']>
interface Props {
  areas: Pick<Area, 'id' | 'name' | 'spriteUrl' | 'height' | 'width'>[]
  items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[],
  sprites: string[],
  initialValues?: InputData,
  onComplete: (paths: string[]) => Promise<unknown>
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

export default function MobForm({ areas, items, sprites, initialValues, onComplete }: Props) {


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

    const { mutate: create, isLoading: createLoading } = api.mob.create.useMutation({
      onSuccess(data) {
        toast({
          title: "Success",
          description: 'Mob Created'
        })
        router.push(`/mobs/${data.slug}`)
        void onComplete(['/mobs'])
      },
      onError() {
        toast({
          title: "Oops",
          description: "An error occurred.",
          variant: "destructive"
        })
      }
    })

    const { mutate: update, isLoading: updateLoading } = api.mob.update.useMutation({
      onSuccess(data) {
        toast({
          title: "Success",
          description: 'Mob Updated'
        })
        if(data.slug !== initialValues?.slug) {
          router.replace(`/mobs/${data.slug}/edit`)
        }
        router.refresh()
        void onComplete(['/mobs', `/mobs/${data.slug}`])
      },
      onError() {
        toast({
          title: "Oops",
          description: "An error occurred.",
          variant: "destructive"
        })
      }
    })

    return (<Form
        schema={mobSchema}
        form={form}
        formProps={{
          loading: updateLoading || createLoading,
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
        onSubmit={data => {
          if(initialValues?.id) {
            update({ data, id: initialValues.id })
          } else {
            create(data)
          }
        }}
    />)
}