'use client'
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";
import { FieldLabel} from "~/components/ui/label";
import { useState } from "react";
import { type z } from "zod";
import { type dropsSchema } from "../schemas";
import { type Item } from "@prisma/client";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { ItemSprite } from "~/components/ItemSprite";
import { type FieldMetadata, control, getInputProps, useFormMetadata, getFieldsetProps, useInputControl } from "@conform-to/react";


type Drops = z.infer<typeof dropsSchema>

type Props = {
  className?: string,
  items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[]
  field: FieldMetadata<Drops | undefined>
  label: string
}

 function ItemField({ items, field }: { items: Props['items'], field: FieldMetadata<string> }) {

  const control = useInputControl(field)
  const [open, setOpen] = useState(false)

  const [selectedItem, setSelectedItem] = useState(items.find(item => item.id === field.value))
  
  return (<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="justify-between col-span-3"
    >
      {selectedItem?.name ?? "Select item..."}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
    <Command>
      <CommandInput placeholder="Search items..." />
      <CommandEmpty>No items found.</CommandEmpty>
      <CommandGroup className="max-h-48 overflow-auto">
        {items.map((item) => (
          <CommandItem
            key={item.id}
            value={item.name}
            onSelect={() => {
              setSelectedItem(item)
              control.change(item.id)
              setOpen(false)
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                field.value === item.id ? "opacity-100" : "opacity-0"
              )}
            />
            <div className="flex items-center gap-x-4">
              <ItemSprite name={item.name} url={item.spriteUrl} size="sm" className="bg-slate-100 border border-slate-200 rounded-md" />
              <div className="text-md">{item.name}</div>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  </PopoverContent>
  <input {...getInputProps(field, { type: 'hidden' })} key={field.key} />
</Popover>)


}

export default function DropItemsMultiField({ className, items, field, label }: Props) {

  const name = field.name
  const form = useFormMetadata(field.formId)
  const fields = field.getFieldList()
  

  return <fieldset {...getFieldsetProps(field)} className={cn(className, "space-y-2 col-span-2")}>
      <FieldLabel field={field}>{label}</FieldLabel>

      <div className="space-y-4">
        {fields.map((f, index) => {

          const { dropRate, itemId } = f.getFieldset()

          return <fieldset key={f.key} {...getFieldsetProps(f)} className="grid grid-cols-4 gap-x-6">
            <div className="grid grid-cols-4 col-span-3 gap-x-3">
            <ItemField
              field={itemId}
              items={items}
            />
            <Input
              placeholder="Drop Rate"
              {...getInputProps(dropRate)}
              key={dropRate.key}
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