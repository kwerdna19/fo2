'use client'
import { cn } from "~/utils/styles";
import { FieldLabel } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { MobSprite } from "~/components/MobSprite";
import { getInputProps, type FieldMetadata } from "@conform-to/react";
import { ItemSprite } from "./ItemSprite";


export default function SpriteSelect({ className, options, field, label, icon }: { className?: string, options: string[], field: FieldMetadata<string>, label: string, icon?: boolean }) {

  const errMessage = field.errors?.at(0)
  const { key, ...props } = getInputProps(field, { type: 'text' })

  return <div className={cn("space-y-2", className)}>
      <FieldLabel field={field}>{label}</FieldLabel>
      <Select key={key} {...props}>
      <SelectTrigger id={field.id} className="flex items-center h-fit min-h-[118px]">
        <SelectValue placeholder={"Select " + label} />
      </SelectTrigger>
      <SelectContent className="max-h-96">
        {
          options.map(o => <SelectItem key={o} value={o}>

            <div className="flex items-center gap-x-12">
              <div className={cn(!icon && "-mt-12 mb-1")}>
                {icon ? <ItemSprite size="md" url={o} name="" /> : <MobSprite size="md" url={o} name=""/>}
              </div>
              <div>
                {o.split('/').at(-1) ?? '?'}
              </div>
            </div>

          </SelectItem>)
        }
      </SelectContent>
    </Select>
      {/* {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null} */}
      {errMessage ? <p id={field.errorId} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null} 
    </div>


}