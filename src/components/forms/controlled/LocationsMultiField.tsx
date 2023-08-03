'use client'
import { useTsController, useFieldInfo } from "@ts-react/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/utils/styles";
import { Label } from "~/components/ui/label";
import { useId, useState } from "react";
import { type z } from "zod";
import { type locationsSchema } from "./schemas";
import { type Area } from "@prisma/client";
import dynamic from "next/dynamic";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { LuMap, LuTrash2 } from "react-icons/lu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog"

// import SingleAreaMap from "~/components/maps/SingleAreaMap"
const SingleAreaMap = dynamic(() => import("~/components/maps/SingleAreaMap"), { ssr: false })

// import LocationInput from "~/components/maps/LocationInput";
const LocationInput = dynamic(() => import("~/components/maps/LocationInput"), { ssr: false })

type Locations = z.infer<typeof locationsSchema>

export default function LocationsMultiField({ className, areas }: { className?: string, areas: Pick<Area, 'id' | 'name' | 'spriteUrl' | 'height' | 'width'>[] }) {

  const { label, isOptional } = useFieldInfo();
  const { field, error } = useTsController<Locations>();
  const [coordInput, setCoordInput] = useState<Locations[number]['coordinates']>()
  const [dialogOpen, setDialogOpen] = useState<Record<number, boolean>>({})

  const errMessage = error?.errorMessage

  const onAdd = () => {
    field.onChange([...(field.value ?? []), {}])
  }

  return <div className={cn("space-y-2 col-span-2")}>
      <Label className={cn(error && "text-destructive", className)}>{label}{isOptional ? null : <span className="pl-0.5 text-red-600">*</span>}</Label>

      <div className="space-y-4">
        {(field.value ?? []).map(({ areaId, coordinates }, i) => {

          const area = areas.find(a => a.id === areaId)

          const setCoordinate = (c: { x?: number, y?: number } | undefined) => {
            field.onChange((field.value ?? []).map((el, index) => {
              if(i === index)
                return Object.assign({}, el, { coordinates: {
                  ...coordinates,
                  ...c
                }})
              return el
            }))
          }

          return <div className="grid grid-cols-4 gap-x-6" key={i}>
            <div className="col-span-2 space-y-2">
              <Select
                value={areaId}
                onValueChange={newId => {
                  field.onChange((field.value ?? []).map((el, index) => {
                    if(i === index)
                      return Object.assign({}, el, { areaId: newId })
                    return el
                  }))
                }}
                defaultValue={areaId}
              >
              <SelectTrigger>
                <SelectValue placeholder="Select Area" />
              </SelectTrigger>
              <SelectContent>
                {
                  areas.map(o => <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>)
                }
              </SelectContent>
              </Select>
              {/* {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
                {placeholder}
              </p> : null}
              {errMessage ? <p id={`${id}-err`} className="text-sm font-medium text-destructive">
                {errMessage}
              </p> : null}  */}
            </div>
            <div className="grid grid-cols-5 gap-x-2 items-center justify-between">
              <Input
                className="col-span-2"
                type="number"
                value={coordinates ? coordinates.x ?? "" : ""}
                placeholder="x"
                disabled={!areaId}
                onChange={e => {
                  setCoordinate({ x: parseInt(e.target.value) })
                }}
              />
              <Input
                className="col-span-2"
                type="number"
                value={coordinates ? coordinates.y ?? "" : ""}
                placeholder="y"
                disabled={!areaId}
                onChange={e => {
                  setCoordinate({ y: parseInt(e.target.value) })
                }}
              />
              <Dialog
                open={dialogOpen[i]}
                onOpenChange={(o) => {
                  setDialogOpen(d => ({...d, [i]: o}))
                  if(!o) {
                    setCoordInput(undefined)
                  }
              }}>
                <DialogTrigger>
                  <Button variant="outline" size="icon" disabled={!areaId}>
                    <LuMap />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-screen-xl w-full">
                    <div className="flex justify-center">
                        {area ? <SingleAreaMap
                          area={{
                            ...area,
                            locations: []
                          }}
                          className="shadow-none"
                        >
                          <LocationInput value={coordInput ?? coordinates} onChange={setCoordInput} />
                        </SingleAreaMap> : <div className="flex items-center justify-center h-full border-dashed border">Select an area to view map and select coordinates</div>}
                    </div>
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        setDialogOpen(d => ({...d, [i]: false}))
                        setCoordinate(coordInput)
                        setCoordInput(undefined)
                      }}
                      disabled={!coordInput && !coordinates?.x && !coordinates?.y}
                    >Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
              <Button size="icon" variant="destructive" onClick={() => {
                  field.onChange((field.value ?? []).filter((_, index) => {
                    return index !== i
                  }))
              }}>
                <LuTrash2 />
            </Button>
          </div>
        })}
        
        <Button onClick={onAdd}>Add</Button>
      </div>
      {/* {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null}
      {errMessage ? <p id={`${id}-err`} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null}  */}
    </div>


}