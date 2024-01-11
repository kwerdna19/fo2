'use client';
import { cn } from "~/utils/styles";
import { useState } from "react";
import { type Npc } from "@prisma/client";
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
import { type FieldMetadata, getInputProps, useInputControl } from "@conform-to/react";
import { MobSprite } from "~/components/MobSprite";

export function NpcField({ npcs, field }: { npcs: Pick<Npc, 'id' | 'name' | 'spriteUrl'>[]; field: FieldMetadata<string>; }) {

  const control = useInputControl(field);
  const [open, setOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(npcs.find(npc => npc.id === field.value));

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
          {npcs.map((npc) => (
            <CommandItem
              key={npc.id}
              value={npc.name}
              onSelect={() => {
                setSelectedItem(npc);
                control.change(npc.id);
                setOpen(false);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  field.value === npc.id ? "opacity-100" : "opacity-0"
                )} />
              <div className="flex items-center gap-x-4">
                <MobSprite name={npc.name} url={npc.spriteUrl} size="xs" className="-mt-3 -mb-1" />
                <div className="text-md">{npc.name}</div>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
    </PopoverContent>
    <input {...getInputProps(field, { type: 'hidden' })} key={field.key} />
  </Popover>);


}
