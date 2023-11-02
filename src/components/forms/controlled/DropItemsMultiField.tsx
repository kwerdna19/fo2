'use client'
import { useTsController, useFieldInfo } from "@ts-react/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { type z } from "zod";
import { type dropsSchema } from "./schemas";
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


type Items = z.infer<typeof dropsSchema>

export default function DropItemsMultiField({ className, items }: { className?: string, items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[] }) {

  const { label, isOptional } = useFieldInfo();
  const { field, error } = useTsController<Items>();

  const [open, setOpen] = useState<Record<number, boolean>>({})


  const onAdd = () => {
    field.onChange([...(field.value ?? []), {}])
  }
  

  return <div className={cn("space-y-2 col-span-2")}>
      <Label className={cn(error && "text-destructive", className)}>{label}{isOptional ? null : <span className="pl-0.5 text-red-600">*</span>}</Label>

      <div className="space-y-4">
        {(field.value ?? []).map(({ item: value, dropRate }, i) => {


        const setItem = (item: Items[number]['item'] | undefined) => {
          field.onChange((field.value ?? []).map((el, index) => {
            if(i === index)
              return Object.assign({}, el, { item })
            return el
          }))
        }


          return <div className="grid grid-cols-4 gap-x-6" key={i}>
            <div className="grid grid-cols-4 col-span-3 gap-x-3">
            <Popover open={open[i]} onOpenChange={(newOpen) => setOpen(o => ({...o, [i]: newOpen }))}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open[i]}
                    className="justify-between col-span-3"
                  >
                    {value?.name ?? "Select item..."}
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
                          onSelect={(currentValue) => {
                            setItem(currentValue === value?.name ? undefined : item)
                            setOpen(o => ({...o, [i]: false}))
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              value?.id === item.id ? "opacity-100" : "opacity-0"
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
            </Popover>
            <Input
              type="number"
              value={dropRate ?? ""}
              placeholder="Drop Rate"
              onChange={e => field.onChange((field.value ?? []).map((el, index) => {
                if(i === index)
                  return Object.assign({}, el, { dropRate: parseFloat(e.target.value) })
                return el
              }))}
            />
            </div>
          <Button size="icon" variant="destructive" onClick={() => {
                field.onChange((field.value ?? []).filter((_, index) => {
                  return index !== i
                }))
            }}>
              <Trash2 />
          </Button>
          </div>
        })}
        
        <Button onClick={onAdd}>Add Item</Button>
      </div>
      {/* {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null}
      {errMessage ? <p id={`${id}-err`} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null}  */}
    </div>


}