import { type SubmissionResult } from '@conform-to/dom'

type BaseReturnType<Error> = SubmissionResult<Error> | undefined

export type ErrorType = string[]


export type ConformServerAction<Error = ErrorType> = (
  previous: BaseReturnType<Error> | undefined,
  formData: FormData,
) => Promise<BaseReturnType<Error>>

