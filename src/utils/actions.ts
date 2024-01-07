'use server'

import { type z } from "zod"
import { type ErrorType, type ConformServerAction } from "~/types/actions"
import { parseWithZod } from "@conform-to/zod"

export const createConformAction = <Schema extends z.ZodTypeAny>(
  schema: Schema,
  fn: (input: z.output<Schema>, prev?: Parameters<ConformServerAction<ErrorType>>[0]) => Promise<unknown>,
): ConformServerAction<ErrorType> => {
  return async (previous, formData) => {
    const submission = parseWithZod(formData, { schema })


    if (submission.status !== 'success') {
      return submission.reply()
    }


    try {
      
      await fn(submission.payload, previous)
      return submission.reply()

    } catch(e) {
      // server err with handler
      return submission.reply({
        formErrors: ['An unknown server error occurred.']
      })
    }

    

  }
}