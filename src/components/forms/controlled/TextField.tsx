'use client'
import { useTsController, useFieldInfo } from "@ts-react/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";
import { Label } from "~/components/ui/label";


export default function TextField({className, id = 'text-feld'}: { className?: string, id?: string }) {

  const { label, placeholder, isOptional } = useFieldInfo();
  const { field, error } = useTsController<string>();

  const errMessage = error?.errorMessage

  return <div className={cn("space-y-2 col-span-1", className)}>
      <Label className={cn(error && "text-destructive", className)} htmlFor={id}>{label}{isOptional ? null : <span className="pl-0.5 text-red-600">*</span>}</Label>
      <Input
        id={id}
        value={field.value ? field.value : ""}
        aria-describedby={
          !error
            ? `${id}-desc`
            : `${id}-err`
        }
        aria-invalid={!!error}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
      />
      {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null}
      {errMessage ? <p id={`${id}-err`} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null} 
    </div>


}