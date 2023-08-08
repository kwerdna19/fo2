'use client'
import { useTsController, useFieldInfo, useEnumValues } from "@ts-react/form";
import { cn } from "~/utils/styles";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"


export default function SimpleSelect({ className, options, id = 'simple-select' }: { className?: string, options?: string[], id?: string }) {
  const { label, placeholder, isOptional } = useFieldInfo();
  const { field, error } = useTsController<string>();
  const enumValues = useEnumValues();

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
      <SelectTrigger>
        <SelectValue placeholder={"Select " + label} />
      </SelectTrigger>
      <SelectContent>
        {
          (options ?? enumValues ?? []).map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)
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