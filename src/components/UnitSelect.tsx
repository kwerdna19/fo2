'use client'
import { cn } from "~/utils/styles";
import { FieldLabel } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { type FieldMetadata, useInputControl } from "@conform-to/react";
import { Unit } from "@prisma/client";
import { UnitSprite } from "./UnitSprite";

const options = Object.values(Unit)

export default function UnitSelect({ className, field, label }: { className?: string, field: FieldMetadata<Unit>, label?: string }) {

  const { required } = field.constraint ?? {}
  const errMessage = field.errors?.at(0)

  const control = useInputControl(field)

  return <div className={cn("space-y-1", className)}>
      {label ? <FieldLabel field={field}>{label}</FieldLabel> : null}
      <Select required={required} value={control.value} onValueChange={control.change}>
      <SelectTrigger id={field.id} className="flex items-center" onKeyDown={e => (!required && (e.key === 'Backspace' || e.key === 'Delete')) ? control.change('') : null}>
        <SelectValue placeholder={"Select Unit"} />
      </SelectTrigger>
      <SelectContent>
        {
          options.map(o => <SelectItem key={o} value={o}>
            <div className="flex gap-x-4">
              <div className="mt-0.5">
                <UnitSprite type={o} size="sm" />
              </div>
              <div>
                {o}
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