'use client'
import { useTsController, useFieldInfo } from "@ts-react/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";
import { Label } from "~/components/ui/label";
import { useId, useState } from "react";
import { type z } from "zod";
import { type itemsSchema } from "./schemas";
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
import { LuCheck, LuChevronsUpDown, LuTrash2 } from "react-icons/lu";


type Items = z.infer<typeof itemsSchema>

export default function ItemsMultiField({ className, items }: { className?: string, items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[] }) {

  const { label, isOptional } = useFieldInfo();
  const { field, error } = useTsController<Items>();

  const [open, setOpen] = useState<Record<number, boolean>>({})

  const errMessage = error?.errorMessage

  const onAdd = () => {
    field.onChange([...(field.value ?? []), {}])
  }

  return <div className={cn("space-y-2 col-span-2")}>
      <Label className={cn(error && "text-destructive", className)}>{label}{isOptional ? null : <span className="pl-0.5 text-red-600">*</span>}</Label>

      <div className="space-y-4">
        {(field.value ?? []).map((value, i) => {


        const setItem = (c: Items[number] | undefined) => {
          field.onChange((field.value ?? []).map((el, index) => {
            if(i === index)
              return c ?? {}
            return el
          }))
        }


          return <div className="flex gap-x-5" key={i}>
          <Popover open={open[i]} onOpenChange={(newOpen) => setOpen(o => ({...o, [i]: newOpen }))}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open[i]}
                  className="w-[300px] justify-between"
                >
                  {value.name ?? "Select item..."}
                  <LuChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search items..." />
                  <CommandEmpty>No items found.</CommandEmpty>
                  <CommandGroup>
                    {items.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.id}
                        onSelect={(currentValue) => {
                          setItem(currentValue === value.id ? undefined : items.find((item) => item.id === currentValue))
                          setOpen(o => ({...o, [i]: false}))
                        }}
                      >
                        <LuCheck
                          className={cn(
                            "mr-2 h-4 w-4",
                            value.id === item.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {item.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
          </Popover>
          {i > 0 ? <Button size="icon" variant="destructive" onClick={() => {
                field.onChange((field.value ?? []).filter((_, index) => {
                  return index !== i
                }))
            }}>
              <LuTrash2 />
          </Button> : null}
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