'use client'
import { type Item } from "@prisma/client"
import { type ConformServerAction } from "~/types/actions"
import { useConform } from "~/hooks/useConform"
import { battlePassSchema } from "../schemas"
import { type getBattlePassBySlug } from "../requests"
import FormInput from "~/components/form-ui/FormInput"
import { Form } from "~/components/form-ui/Form"
import { BattlePassTiersMultiField } from "./BattlePassTiersMultiField"


interface Props {
  items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[],
  defaultValue?: Awaited<ReturnType<typeof getBattlePassBySlug>>,
  action: ConformServerAction
}

export function BattlePassForm({ items, action: serverAction, defaultValue }: Props) {

  
    const [form, fields, action, lastResult] = useConform(serverAction, {
      schema: battlePassSchema,
      defaultValue,
    })

    if(lastResult?.status === 'error') {
      console.log('DEBUG', lastResult)
    }

    const buttonText = defaultValue ? 'Update' : 'Create'

    return (<Form form={form} action={action} submit={buttonText}>
        <FormInput label="Name" field={fields.name} />
        <FormInput label="Desc" field={fields.desc} />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Start Date" field={fields.startDate} type="date" />
          <FormInput label="End Date" field={fields.endDate} type="date" />
        </div>
        <FormInput label="Note" field={fields.note} />





        <div className="col-span-2">
          <BattlePassTiersMultiField label="Tiers" items={items} field={fields.tiers}  />
        </div>



    </Form>
    )
}