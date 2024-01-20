'use client'
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";
import { FieldLabel } from "~/components/ui/label";
import { type z } from "zod";
import { type saleItemsSchema } from "../schemas";
import { type Item } from "@prisma/client";
import { Button } from "~/components/ui/button";
import { Trash2 } from "lucide-react";
import { type FieldMetadata, control, getInputProps, useFormMetadata, getFieldsetProps } from "@conform-to/react";
import { ItemField } from "~/features/items/components/ItemField";
import FormCheckbox from "~/components/form-ui/FormCheckbox";


type SaleItems = z.infer<typeof saleItemsSchema>

type Props = {
  className?: string,
  items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[]
  field: FieldMetadata<SaleItems | undefined>
  label: string
}


export function NpcItemsMultiField({ className, items, field, label }: Props) {

  const name = field.name
  const form = useFormMetadata(field.formId)
  const fields = field.getFieldList()
  

  return <fieldset {...getFieldsetProps(field)} className={cn(className, "space-y-2 col-span-2")}>
      <FieldLabel field={field}>{label}</FieldLabel>

      <div className="space-y-4">
        {fields.map((f, index) => {

          const { itemId, price, gems } = f.getFieldset()

          return <fieldset key={f.key} {...getFieldsetProps(f)} className="grid grid-cols-4 gap-x-6">
            <div className="grid grid-cols-4 col-span-3 gap-x-3">
            <ItemField
              field={itemId}
              items={items}
              className="col-span-3"
            />
            <Input
              placeholder="Price"
              {...getInputProps(price, { type: 'number' })}
              key={price.key}
            />
            <FormCheckbox
              label="Gems?"
              field={gems}
            />
            </div>
            <Button size="icon" variant="destructive" {...form.getControlButtonProps(control.remove({ index, name }))}>
                <Trash2 className="h-5 w-5" />
            </Button>
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