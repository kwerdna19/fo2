'use client'
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";
import { FieldLabel } from "~/components/ui/label";
import { useState } from "react";
import { type z } from "zod";
import { type droppedBySchema } from "../schemas";
import { type Mob } from "@prisma/client";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { type FieldMetadata, control, getInputProps, useFormMetadata, getFieldsetProps, useInputControl } from "@conform-to/react";
import { MobSprite } from "~/components/MobSprite";


type DroppedBy = z.infer<typeof droppedBySchema>

type Props = {
  className?: string,
  mobs: Pick<Mob, 'id' | 'name' | 'spriteUrl'>[]
  field: FieldMetadata<DroppedBy | undefined>
  label: string
}

 function MobField({ mobs, field }: { mobs: Props['mobs'], field: FieldMetadata<string> }) {

  const control = useInputControl(field)
  const [open, setOpen] = useState(false)

  const [selectedItem, setSelectedItem] = useState(mobs.find(mob => mob.id === field.value))
  
  return (<Popover open={open} onOpenChange={setOpen}>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open}
      className="justify-between col-span-3"
    >
      <div className="flex items-center gap-x-3">
        {!!selectedItem && <MobSprite name={selectedItem.name} url={selectedItem.spriteUrl} size="xs" />}
        {selectedItem?.name ?? "Select item..."}
      </div>
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  </PopoverTrigger>
  <PopoverContent align="start" className="w-[--radix-popover-trigger-width] p-0">
    <Command>
      <CommandInput placeholder="Search items..." />
      <CommandEmpty>No items found.</CommandEmpty>
      <CommandGroup className="max-h-48 overflow-auto">
        {mobs.map((mob) => (
          <CommandItem
            key={mob.id}
            value={mob.name}
            onSelect={() => {
              setSelectedItem(mob)
              control.change(mob.id)
              setOpen(false)
            }}
          >
            <Check
              className={cn(
                "mr-2 h-4 w-4",
                field.value === mob.id ? "opacity-100" : "opacity-0"
              )}
            />
            <div className="flex items-center gap-x-4">
              <MobSprite name={mob.name} url={mob.spriteUrl} size="xs" className="-mt-3 -mb-1" />
              <div className="text-md">{mob.name}</div>
            </div>
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  </PopoverContent>
  <input {...getInputProps(field, { type: 'hidden' })} key={field.key} />
</Popover>)


}

export default function DroppedByMobsMultiField({ className, mobs, field, label }: Props) {

  const name = field.name
  const form = useFormMetadata(field.formId)
  const fields = field.getFieldList()
  

  return <fieldset {...getFieldsetProps(field)} className={cn(className, "space-y-2 col-span-2")}>
      <FieldLabel field={field}>{label}</FieldLabel>

      <div className="space-y-4">
        {fields.map((f, index) => {

          const { dropRate, mobId } = f.getFieldset()

          return <fieldset key={f.key} {...getFieldsetProps(f)} className="grid grid-cols-4 gap-x-6">
            <div className="grid grid-cols-4 col-span-3 gap-x-3">
            <MobField
              field={mobId}
              mobs={mobs}
            />
            <Input
              placeholder="Drop Rate"
              {...getInputProps(dropRate, { type: 'number' })}
              key={dropRate.key}
            />
            </div>
            <Button size="icon" variant="destructive" {...form.getControlButtonProps(control.remove({ index, name }))}>
                <Trash2 className="h-5 w-5" />
            </Button>
          </fieldset>
        })}
        
        <Button {...form.getControlButtonProps(control.insert({ name }))}>Add Mob</Button>
      </div>
      {/* {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null}
      {errMessage ? <p id={`${id}-err`} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null}  */}
    </fieldset>


}