'use client'
import { useTsController, useFieldInfo } from "@ts-react/form";
import { cn } from "~/utils/styles";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";


export default function CheckboxField({className, id = 'checkbox-feld'}: { className?: string, id?: string }) {

  const { label, placeholder, isOptional } = useFieldInfo();
  const { field, error } = useTsController<boolean>();

  const errMessage = error?.errorMessage

  return <div className={cn("space-y-2 col-span-1", className)}>
      <Label className={cn(error && "text-destructive", "block")} htmlFor={id}>{label}{isOptional ? null : <span className="pl-0.5 text-red-600">*</span>}</Label>
      <div className="px-1">
      <Checkbox
      checked={field.value}
      onCheckedChange={val => field.onChange(!!val)}
      />
      </div>
      {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null}
      {errMessage ? <p id={`${id}-err`} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null} 
    </div>


}