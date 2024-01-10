import { type SubmissionResult } from '@conform-to/dom'


export type ErrorType = string[]

export type ConformResult<Error = ErrorType> = SubmissionResult<Error> | undefined


export type ConformServerAction<Error = ErrorType> = (
  previous: ConformResult<Error> | undefined,
  formData: FormData,
) => Promise<ConformResult<Error>>

