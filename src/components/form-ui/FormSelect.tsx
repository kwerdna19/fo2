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
import { type FieldMetadata, useInputControl } from "@conform-to/react";

export default function FormSelect({ className, options, field, label }: { className?: string, options: string[], field: FieldMetadata<string>, label: string }) {

  const errMessage = field.errors?.at(0)
  const control = useInputControl(field)

  return <div className={cn("space-y-1", className)}>
      <FieldLabel field={field}>{label}</FieldLabel>
      <Select value={control.value} onValueChange={control.change}>
      <SelectTrigger id={field.id} className="flex items-center">
        <SelectValue placeholder={"Select " + label} />
      </SelectTrigger>
      <SelectContent className="max-h-96">
        {
          options.map(o => <SelectItem key={o} value={o}>
            {o}
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