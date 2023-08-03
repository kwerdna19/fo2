'use client'
import { createTsForm } from "@ts-react/form";
import { z } from "zod";
import TextField from "./controlled/TextField";
import { type ReactNode } from "react";
import { Button } from "../ui/button";
import { itemsSchema, locationsSchema, nameSchema, selectedAreaSchema } from "./controlled/schemas";
import AreaSelect from "./controlled/AreaSelect";
import LocationsMultiField from "./controlled/LocationsMultiField";
import ItemsMultiField from "./controlled/ItemsMultiField";

const mapping = [
  [nameSchema, TextField],
  [selectedAreaSchema, AreaSelect],
  [locationsSchema, LocationsMultiField],
  [itemsSchema, ItemsMultiField]
  // [z.boolean(), CheckBoxField],
  // [z.number(), NumberField],
] as const;

function FormComponent({ children, className, onSubmit }: { children: ReactNode, className?: string, onSubmit: () => void }) {


  return <form onSubmit={onSubmit} className={className}>
    <div className="grid grid-cols-2 gap-5">
      {children}
    </div>
    <div className="flex justify-end mt-12">
      <Button type="submit">Submit</Button>
    </div>
  </form>

}

export const Form = createTsForm(mapping, {FormComponent: FormComponent});