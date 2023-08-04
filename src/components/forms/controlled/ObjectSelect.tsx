'use client'
import { useTsController, useFieldInfo } from "@ts-react/form";
import { cn } from "~/utils/styles";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { type z } from "zod";
import { type selectedAreaSchema } from "./schemas";

type Area = z.infer<typeof selectedAreaSchema>

export default function AreaSelect({ className, options }: { className?: string, options: Pick<Area, 'id' | 'name'>[] }) {

  const { label, placeholder, isOptional } = useFieldInfo();
  const { field, error } = useTsController<Area>();
  const id = 'area-select'

  const errMessage = error?.errorMessage

  return <div className={cn("space-y-2 col-span-1", className)}>
      <Label className={cn(error && "text-destructive", className)} htmlFor={id}>{label}{isOptional ? null : <span className="pl-0.5 text-red-600">*</span>}</Label>
      <Select
        value={field.value?.id}
        aria-describedby={
          !error
            ? `${id}-desc`
            : `${id}-err`
        }
        aria-invalid={!!error}
        onValueChange={newId => field.onChange(options.find(o => o.id === newId))}
        defaultValue={field.value?.id}
      >
      <SelectTrigger>
        <SelectValue placeholder={"Select " + label} />
      </SelectTrigger>
      <SelectContent>
        {
          options.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)
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