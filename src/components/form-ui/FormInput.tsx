'use client'
import { cn } from "~/utils/styles";
import { FieldLabel } from "~/components/ui/label";
import { getInputProps, type FieldMetadata } from "@conform-to/react";
import { Input } from "../ui/input";


export default function FormInput({ className, field, label, type = 'text', placeholder }: { className?: string, field: FieldMetadata<string | number | null | undefined>, label: string, type?: 'text' | 'number', placeholder?: string }) {

  const errMessage = field.errors?.at(0)

  return (<div className={cn("space-y-1", className)}>
      <FieldLabel field={field}>{label}</FieldLabel>
      <Input {...getInputProps(field, { type })} key={field.key} placeholder={placeholder} />
      {/* {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null} */}
      {errMessage ? <p id={field.errorId} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null} 
    </div>)


}