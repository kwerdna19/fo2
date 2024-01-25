import { type FieldMetadata, getInputProps } from "@conform-to/react";



// used with useInputControl to ensure values submit correctly...


export function ControlledHiddenField({ field, value }: { field: FieldMetadata<string | number>, value: string | number | undefined }) {
  return <input {...getInputProps(field, { type: 'hidden', value: false })} value={value ?? ''} key={field.key} />
}