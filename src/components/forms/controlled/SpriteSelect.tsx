'use client'
import { useTsController, useFieldInfo } from "@ts-react/form";
import { cn } from "~/utils/styles";
import { Label } from "~/components/ui/label";
import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { MobSprite } from "~/components/MobSprite";


export default function SpriteSelect({ className, options }: { className?: string, options: string[] }) {

  const { label, placeholder, isOptional } = useFieldInfo();
  const { field, error } = useTsController<string>();
  const id = useId()

  const errMessage = error?.errorMessage

  return <div className={cn("space-y-2 col-span-1", className)}>
      <Label className={cn(error && "text-destructive", className)} htmlFor={id}>{label}{isOptional ? null : <span className="pl-0.5 text-red-600">*</span>}</Label>
      <Select
        value={field.value}
        aria-describedby={
          !error
            ? `${id}-desc`
            : `${id}-err`
        }
        aria-invalid={!!error}
        onValueChange={field.onChange}
        defaultValue={field.value}
      >
      <SelectTrigger className="flex items-center h-fit min-h-[118px]">
        <SelectValue placeholder={"Select " + label} />
      </SelectTrigger>
      <SelectContent className="max-h-96">
        {
          options.map(o => <SelectItem key={o} value={o}>


            <div className="flex items-center gap-x-12">
              <div className="-mt-12 mb-1">
                <MobSprite size="md" url={o} name={o.split('/').at(-1) ?? 'npc'}/>
              </div>
              <div>
                {o.split('/').at(-1)?.replace(/^npc-/, '').replace(/\.png$/, '').replace(/\-icon$/, '').replace(/\-/, ' ').replace(/q(\d+)/, ' v$1') ?? '?'}
              </div>
            </div>

          </SelectItem>)
        }
      </SelectContent>
    </Select>
      {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null}
      {errMessage ? <p id={`${id}-err`} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null} 
    </div>


}