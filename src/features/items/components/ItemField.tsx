'use client';
import { cn } from "~/utils/styles";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "~/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { ItemSprite } from "~/components/ItemSprite";
import { type FieldMetadata, getInputProps, useInputControl } from "@conform-to/react";
import { type Item } from "@prisma/client";

export function ItemField({ items, field, className }: { items: Pick<Item, 'id' | 'name' | 'spriteUrl'>[]; field: FieldMetadata<string>; className?: string }) {

  const control = useInputControl(field);
  const [open, setOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(items.find(item => item.id === field.value));

  return (<Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn("justify-between", className)}
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
                setSelectedItem(item);
                control.change(item.id);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  field.value === item.id ? "opacity-100" : "opacity-0"
                )} />
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
  </Popover>);


}
