'use client'
import { useTsController, useFieldInfo } from "@ts-react/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";
import { Label } from "~/components/ui/label";
import { useId } from "react";
import { type z } from "zod";
import { type coordinatesSchema } from "./schemas";
import { type Area } from "@prisma/client";
import dynamic from "next/dynamic";

// import SingleAreaMap from "~/components/maps/SingleAreaMap"
const SingleAreaMap = dynamic(() => import("~/components/maps/SingleAreaMap"), { ssr: false })


type Coordinates = z.infer<typeof coordinatesSchema>
export default function MapCoordinates({className, area}: { className?: string, area: Pick<Area, 'id' | 'spriteUrl' | 'height' | 'width'> }) {

  console.log({area})
  const { label, placeholder, isOptional } = useFieldInfo();
  const { field, error } = useTsController<Coordinates>();
  const id = useId()

  const errMessage = error?.errorMessage

  return <div className={cn("col-span-2", className)}>
      <Label className={cn(error && "text-destructive", className)} htmlFor={id}>{label}{isOptional ? null : <span className="pl-0.5 text-red-600">*</span>}</Label>
      <div className="grid grid-cols-4">
        <div className="w-full flex flex-col col-span-4">
          {area ? <SingleAreaMap
            area={{
              ...area,
              locations: []
            }}
          /> : null}
        </div>
        <div className="grid grid-cols-2 gap-x-3">
          <Input
            id={id}
            type="number"
            readOnly
            value={field.value?.x ?? ""}
            placeholder="X"
            // aria-describedby={
            //   !error
            //     ? `${id}-desc`
            //     : `${id}-err`
            // }
            // aria-invalid={!!error}
            // onChange={(e) => {
            //   field.onChange(e.target.value);
            // }}
          />
            <Input
            id={id}
            type="number"
            readOnly
            value={field.value?.y ?? ""}
            placeholder="Y"
            // aria-describedby={
            //   !error
            //     ? `${id}-desc`
            //     : `${id}-err`
            // }
            // aria-invalid={!!error}
            // onChange={(e) => {
            //   field.onChange(e.target.value);
            // }}
          />
        </div>


      </div>

      {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null}
      {errMessage ? <p id={`${id}-err`} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null} 
    </div>


}