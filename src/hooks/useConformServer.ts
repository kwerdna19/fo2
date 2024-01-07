'use client'

import { type z } from 'zod'
import { useFormState } from 'react-dom'
import { getFormProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { type FormOptions } from '@conform-to/dom'
import { type ErrorType, type ConformServerAction } from '~/types/actions'



// serverAction must be passed in from prop from a Server Component
export const useConform = <Schema extends z.ZodType>(
  serverAction: ConformServerAction<ErrorType>,
  {
    schema,
    ...options
  }: Omit<FormOptions<z.output<Schema>, unknown>, 'lastResult' | 'onValidate' | 'lastSubmission' | 'shouldValidate' | 'shouldDirtyConsider' | 'formId'> & {
    schema: Schema
  },
) => {
  
  const [lastResult, action] = useFormState(serverAction, undefined)

  const [form, fields] = useForm<z.output<Schema>, ErrorType>({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
    shouldValidate: 'onBlur',
    shouldDirtyConsider(name) {
      return !name.startsWith('$ACTION');
    },
    ...options
  })

  const formProps = {
    ...getFormProps(form),
    action
  }

  return [formProps, fields, lastResult] as const
}
