"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/utils/styles"
import { getInputProps, type FieldMetadata } from "@conform-to/react"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  >
    {children}
  </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName



const FieldLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { field: FieldMetadata<unknown> } &
    VariantProps<typeof labelVariants>
>(({ className, children, field, ...props }, ref) => {

  const { required } = field.constraint ?? {}

  return   <Label
  ref={ref}
  className={cn(labelVariants(), (field.errors && field.errors.length > 0) && "text-destructive", className)}
  htmlFor={field.id}
  {...props}
>
  {children}
  {required ? <span className="text-destructive pl-0.5">*</span> : null}
</Label>
})
FieldLabel.displayName = 'FieldLabel'

export { Label, FieldLabel }
