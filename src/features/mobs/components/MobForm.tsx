'use client'
import { type Item, type Area } from "@prisma/client"
import { type ConformServerAction } from "~/types/actions"
import { useConform } from "~/hooks/useConform"
import { mobSchema } from "../schemas"
import { type getMobBySlug } from "../requests"
import SpriteSelect from "~/components/SpriteSelect"
import FormCheckbox from "~/components/form-ui/FormCheckbox"
import FormInput from "~/components/form-ui/FormInput"
import LocationsMultiField from "~/features/areas/components/LocationsMultiField"
import DropItemsMultiField from "./DropItemsMultiField"
import { Form } from "~/components/form-ui/Form"


interface Props {
  areas: Pick<Area, 'id' | 'name' | 'spriteUrl' | 'height' | 'width'>[]
  items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[],
  sprites: string[],
  defaultValue?: Awaited<ReturnType<typeof getMobBySlug>>,
  action: ConformServerAction
}

export function MobForm({ areas, items, sprites, action: serverAction, defaultValue }: Props) {
  
    const [form, fields, action, lastResult] = useConform(serverAction, {
      schema: mobSchema,
      defaultValue,
    })

    if(lastResult?.status === 'error') {
      console.log('DEBUG', lastResult)
    }

    const buttonText = defaultValue ? 'Update' : 'Create'

    return (<Form form={form} action={action} submit={buttonText}>
        <FormInput label="Name" field={fields.name} />
        <FormInput label="Level" field={fields.level} type="number" />
        <SpriteSelect
          field={fields.spriteUrl}
          label="Sprite"
          options={sprites}
        />
        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Dmg Min" field={fields.dmgMin} type="number" />
          <FormInput label="Dmg Max" field={fields.dmgMax} type="number" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Min Gold" field={fields.goldMin} type="number" />
          <FormInput label="Max Gold" field={fields.goldMax} type="number" />
        </div>
        
        <FormInput label="Health" field={fields.health} type="number" />
        <FormCheckbox field={fields.boss} label="Boss" />

        <FormInput label="Atk Speed" field={fields.atkSpeed} type="number" />

        <div className="col-span-2">
          <LocationsMultiField label="Locations" areas={areas} field={fields.locations} formId={form.id}  />
        </div>

        <div className="col-span-2">
          <DropItemsMultiField label="Drops" items={items} field={fields.drops} />
        </div>


    </Form>
    )
}