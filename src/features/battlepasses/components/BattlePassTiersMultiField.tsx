'use client'
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";
import { FieldLabel } from "~/components/ui/label";
import { type z } from "zod";
import { type battlePassSchema } from "../schemas";
import { type Item } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { type FieldMetadata, control, getInputProps, useFormMetadata, getFieldsetProps } from "@conform-to/react";
import { ItemField } from "~/features/items/components/ItemField";
import FormCheckbox from "~/components/form-ui/FormCheckbox";
import UnitSelect from "~/components/UnitSelect";


type Tiers = z.infer<typeof battlePassSchema>['tiers']

type Props = {
  className?: string,
  items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[]
  field: FieldMetadata<Tiers>
  label: string
}


export function BattlePassTiersMultiField({ className, items, field, label }: Props) {

  const name = field.name
  const form = useFormMetadata(field.formId)
  const fields = field.getFieldList()
  

  return <fieldset {...getFieldsetProps(field)} className={cn(className, "space-y-2 col-span-2")}>
      <FieldLabel field={field}>{label}</FieldLabel>

      <div className="space-y-4">
        {fields.map((f, index) => {

          const { itemId, amount, unit } = f.getFieldset()

          const amountProps = getInputProps(amount, { type: 'number' })
          // @TODO - temp to fix issue causing text to disappear on move
          delete amountProps.key

          return <fieldset key={f.key} {...getFieldsetProps(f)} className="grid grid-cols-4 gap-x-6">
            <div className="grid col-span-3 gap-x-3 grid-cols-[50px_1fr_50px_1fr]">
              <div className="flex items-center justify-center text-lg">
                {index+1}
              </div>
              <ItemField
                field={itemId}
                items={items}
              />

              <div className="flex items-center justify-center text-muted-foreground text-xs">
                and/or
              </div>
    
              <div className="flex gap-x-3">
                <Input
                  className="flex-grow-[2]"
                  placeholder="Amount"
                  {...amountProps}
                />
                <UnitSelect
                  className="basis-36 flex-shrink-0"
                  field={unit}
                />
              </div>
            </div>
            <div className="flex gap-x-3 px-3">
              <Button size="icon" variant="destructive" {...form.getControlButtonProps(control.remove({ index, name }))}>
                <Trash2 className="h-5 w-5" />
              </Button>

              <Button size="icon" variant="default" {...form.getControlButtonProps(control.reorder({ from: index, to: index-1, name }))}>
                <ArrowUp className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="default" {...form.getControlButtonProps(control.reorder({ from: index, to: index+1, name }))}>
                <ArrowDown className="h-5 w-5" />
              </Button>

            </div>
          </fieldset>
        })}
        
        <Button {...form.getControlButtonProps(control.insert({ name }))}>Add Item</Button>
      </div>
      {/* {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null}
      {errMessage ? <p id={`${id}-err`} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null}  */}
    </fieldset>


}