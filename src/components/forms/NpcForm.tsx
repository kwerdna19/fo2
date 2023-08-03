// import { notFound } from "next/navigation"
// import { ItemSprite } from "~/components/ItemSprite"
'use client'
import { z } from "zod"
import { Form } from "~/components/forms/Form"
import { nameSchema } from "./controlled/schemas"

const schema = z.object({
  name: nameSchema
})

export default function NpcForm() {


    return (<Form
        schema={schema}
        onSubmit={v => {
          console.log("SUBIMT", v)
        }}
    />)
}