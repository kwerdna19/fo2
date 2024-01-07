'use client'

import { type z } from 'zod'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { type FormOptions } from '@conform-to/dom'
import { type ErrorType } from '~/types/actions'


export const useConform = <Schema extends z.ZodType>({
    schema,
    ...options
  }: Omit<FormOptions<z.output<Schema>, ErrorType>, 'onValidate' | 'shouldValidate' | 'shouldDirtyConsider' | 'formId'> & {
    schema: Schema
  },
) => {
  
  return useForm<z.output<Schema>, ErrorType>({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema })
    },
    shouldValidate: 'onBlur',
    shouldDirtyConsider(name) {
      return !name.startsWith('$ACTION');
    },
    ...options
  })



}
