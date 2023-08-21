'use client'
import { createTsForm } from "@ts-react/form";

import { z } from "zod";
import TextField from "./controlled/TextField";
import { type ReactNode } from "react";
import { Button } from "../ui/button";
import { dropsSchema, locationsSchema, npcTypeSchema, saleItemsSchema, spriteSelectSchema } from "./controlled/schemas";
import LocationsMultiField from "./controlled/LocationsMultiField";
import SaleItemsMultiField from "./controlled/SaleItemsMultiField";
import SpriteSelect from "./controlled/SpriteSelect";
import SimpleSelect from "./controlled/SimpleSelect";
import { LuLoader2 } from "react-icons/lu";
import DropItemsMultiField from "./controlled/DropItemsMultiField";
import NumberField from "./controlled/NumberField";
import CheckboxField from "./controlled/CheckboxField";


const mapping = [
  [z.string(), TextField],
  [z.boolean(), CheckboxField],
  [z.number(), NumberField],

  // more custom
  [locationsSchema, LocationsMultiField],
  [saleItemsSchema, SaleItemsMultiField],
  [spriteSelectSchema, SpriteSelect],
  [npcTypeSchema, SimpleSelect],

  [dropsSchema, DropItemsMultiField]
] as const;

function FormComponent({ children, className, onSubmit, loading, dirty, button = 'Submit' }: { children: ReactNode, className?: string, onSubmit: () => void, loading: boolean, dirty: boolean, button?: string }) {

  return <form onSubmit={onSubmit} className={className}>
    <div className="grid grid-cols-2 gap-5">
      {children}
    </div>
    <div className="flex justify-end mt-12">
      <Button disabled={loading || !dirty} type="submit">
        {loading && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
        {button}
      </Button>
    </div>
  </form>

}

export const Form = createTsForm(mapping, {FormComponent: FormComponent});