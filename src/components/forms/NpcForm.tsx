// import { notFound } from "next/navigation"
// import { ItemSprite } from "~/components/ItemSprite"
'use client'
import { z } from "zod"
import { Form } from "~/components/forms/Form"
import { coordinatesSchema, nameSchema, selectedAreaSchema } from "./controlled/schemas"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: nameSchema,
  area: selectedAreaSchema,
  coordinates: coordinatesSchema
})

type Schema = z.infer<typeof schema>

interface Props {
  areas: Schema['area'][]
}

export default function NpcForm({ areas }: Props) {

  const form = useForm<Schema>({ resolver: zodResolver(schema) });
  const area = useWatch({ control: form.control, name: 'area' });

    return (<Form
        form={form}
        schema={schema}
        props={{
          area: {
            options: areas
          },
          coordinates: {
            area
          }
        }}
        onSubmit={v => {
          console.log("SUBIMT", v)
        }}
    />)
}