'use client'
import { cn } from "~/utils/styles";
import { FieldLabel } from "~/components/ui/label";
import { getInputProps, type FieldMetadata } from "@conform-to/react";
import { Input } from "../ui/input";


type Props = { className?: string, field: FieldMetadata<string | number | null | Date | undefined>, label: string, type?: 'text' | 'number' | 'date' | 'datetime-local', placeholder?: string }


const getDefaultValue = (type: Props['type'], defaultValue: string | undefined) => {

  if(!type || !defaultValue || type === 'text' || type === 'number') {
    return defaultValue
  }

  if(type === 'date') {
    return defaultValue.split('T').at(0)
  }

  if(type === 'datetime-local') {
    return defaultValue.split('Z').at(0)
  }

  return defaultValue

}

export default function FormInput({ className, field, label, type = 'text', placeholder }: Props) {

  const errMessage = field.errors?.at(0)

  const props = getInputProps(field, { type })
  const defaultValue = getDefaultValue(type, props.defaultValue)

  return (<div className={cn("space-y-1", className)}>
      <FieldLabel field={field}>{label}</FieldLabel>
      <Input {...props} defaultValue={defaultValue} key={props.key} placeholder={placeholder} />
      {/* {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null} */}
      {errMessage ? <p id={field.errorId} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null} 
    </div>)


}