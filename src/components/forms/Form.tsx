'use client'
import { createTsForm } from "@ts-react/form";
import { z } from "zod";
import TextField from "./controlled/TextField";
import { type ReactNode } from "react";
import { Button } from "../ui/button";
import { nameSchema } from "./controlled/schemas";

const mapping = [
  [nameSchema, TextField],
  // [z.boolean(), CheckBoxField],
  // [z.number(), NumberField],
] as const;

function FormComponent({ children, className, onSubmit }: { children: ReactNode, className?: string, onSubmit: () => void }) {


  return <form onSubmit={onSubmit} className={className}>
    <div className="grid grid-cols-2 gap-5">
      {children}
    </div>
    <div className="flex justify-end mt-5">
      <Button type="submit">Submit</Button>
    </div>
  </form>

}

export const Form = createTsForm(mapping, {FormComponent: FormComponent});