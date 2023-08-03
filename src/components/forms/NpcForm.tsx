// import { notFound } from "next/navigation"
// import { ItemSprite } from "~/components/ItemSprite"
'use client'
import { z } from "zod"
import { Form } from "~/components/forms/Form"
import { coordinatesSchema, itemsSchema, locationsSchema, nameSchema, selectedAreaSchema } from "./controlled/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { type Item, type Area } from "@prisma/client"

const schema = z.object({
  name: nameSchema,
  // area: selectedAreaSchema,
  // coordinates: coordinatesSchema
  locations: locationsSchema,
  items: itemsSchema
})

type Schema = z.infer<typeof schema>

interface Props {
  areas: Pick<Area, 'id' | 'name' | 'spriteUrl' | 'height' | 'width'>[]
  items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[]
}
 
export default function NpcForm({ areas, items }: Props) {

  const form = useForm<Schema>({ resolver: zodResolver(schema) });

    return (<Form
        form={form}
        schema={schema}
        props={{
          locations: {
            areas,
          },
          items: {
            items
          }
        }}
        defaultValues={{
          locations: [{}],
          items: [{}]
        }}
        onSubmit={v => {
          console.log("SUBIMT", v)
        }}
    />)
}