'use client'
import { createTsForm, createUniqueFieldSchema } from "@ts-react/form";
import { z } from "zod";
import TextField from "./controlled/TextField";
import { type ReactNode } from "react";
import { Button } from "../ui/button";
import { locationsSchema, npcTypeSchema, saleItemsSchema } from "./controlled/schemas";
import LocationsMultiField from "./controlled/LocationsMultiField";
import SaleItemsMultiField from "./controlled/SaleItemsMultiField";
import SpriteSelect from "./controlled/SpriteSelect";
import SimpleSelect from "./controlled/SimpleSelect";
import { LuLoader2 } from "react-icons/lu";

export const spriteSelectSchema = createUniqueFieldSchema(z.string().describe('Sprite'), 'sprite')

const mapping = [
  [z.string(), TextField],
  // [z.boolean(), CheckBoxField],
  // [z.number(), NumberField],

  // more custom
  [locationsSchema, LocationsMultiField],
  [saleItemsSchema, SaleItemsMultiField],
  [spriteSelectSchema, SpriteSelect],
  [npcTypeSchema, SimpleSelect],
] as const;

function FormComponent({ children, className, onSubmit, loading }: { children: ReactNode, className?: string, onSubmit: () => void, loading: boolean }) {


  return <form onSubmit={onSubmit} className={className}>
    <div className="grid grid-cols-2 gap-5">
      {children}
    </div>
    <div className="flex justify-end mt-12">
      <Button disabled={loading} type="submit">
        {loading && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit
      </Button>
    </div>
  </form>

}

export const Form = createTsForm(mapping, {FormComponent: FormComponent});