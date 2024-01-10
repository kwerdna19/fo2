'use client'
import { Button } from "~/components/ui/button"
import { FormProvider, control, getFormProps } from "@conform-to/react"
import { FormButton } from "~/components/FormButton"
import { type FormHTMLAttributes, type ReactNode } from "react"
import { cn } from "~/utils/styles"
import { type useConform } from "~/hooks/useConform"


interface Props {
  form: ReturnType<typeof useConform>[0]
  action: FormHTMLAttributes<HTMLFormElement>['action']
  submit?: string
  children: ReactNode
  className?: string
}

export function Form({ form, action, className, children, submit = 'Submit' }: Props) {
  
    return (<FormProvider context={form.context}>
      <form action={action} {...getFormProps(form)}>
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8", className)}>
        {children}
      </div>
      <div className="flex justify-end pt-4 space-x-5">
        <Button variant="ghost" {...form.getControlButtonProps(control.reset())}>Reset</Button>
        <FormButton disabled={!form.dirty}>{submit}</FormButton>
      </div>
      </form>
    </FormProvider>
    )
}