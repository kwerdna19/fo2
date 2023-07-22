import {
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
} from "@tanstack/react-table"
import { TbCrown as Crown, TbArrowDown as ArrowDown, TbArrowUp as ArrowUp } from "react-icons/tb";
import { useState } from "react"

import { Button } from "~/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { type RouterOutputs, api } from "~/utils/api"
import { MobSprite } from "./MobSprite"
import { cn } from "~/utils/styles"
import { ItemSprite } from "./ItemSprite"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
import { UnitSprite } from "./UnitSprite"
import { DebouncedInput } from "./DebouncedInput"
import { Checkbox } from "./ui/checkbox"


type Datum = RouterOutputs['mob']['getAll'][number]
const columnHelper = createColumnHelper<Datum>()

export const columns = [
  columnHelper.display({
    id: 'sprite',
    size: 32,
    cell: ({ row }) => <div className="flex justify-center">
      <MobSprite url={row.original.spriteUrl} name={row.original.name} size="sm" />
    </div>
  }),
  columnHelper.accessor('level', {
    cell: info => <div className="flex justify-center">{info.getValue()}</div>,
    size: 6,
    header: ({ column }) => {
      const sort = column.getIsSorted()
      return (
        <div className="flex justify-center">
                  <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
        >
          Level
          {sort ? (sort === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />) : null}
          
        </Button>
        </div>
      )
  }}),
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
    header: ({ column }) => {
      const sort = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
        >
          Name
          {sort ? (sort === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />) : null}
          
        </Button>
      )
    }
  }),
  columnHelper.accessor('boss', {
    size: 6,
    header: () => null,
    cell: ({ row }) => row.original.boss ? <div className="flex justify-center"><Crown className="h-5 w-5 text-yellow-600" /></div> : '',
  }),
  columnHelper.accessor(row => (row.goldMin+row.goldMax)/2, {
    id: 'gold',
    size: 12,
    cell: ({ row }) => <div className="flex items-center gap-x-2 justify-center">{row.original.goldMax === row.original.goldMin ? row.original.goldMin : `${row.original.goldMin}-${row.original.goldMax}`}<UnitSprite type="coin" size="sm" /></div>,
    header: ({ column }) => {
      const sort = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
        >
          Gold
          {sort ? (sort === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />) : null}
          
        </Button>
      )
    }
  }),
  columnHelper.accessor('health', {
    size: 12,
    cell: info => <div className="flex justify-center">{info.getValue()}</div>,
    header: ({ column }) => {
      const sort = column.getIsSorted()
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
        >
          Health
          {sort ? (sort === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />) : null}
          
        </Button>
      )
    },
  }),

  columnHelper.accessor(row => row.drops.map(d => d.item.name).join(', '), {
    id: 'loot',
    header: 'Loot',
    size: 360,
    cell: ({ row }) => <div className="flex items-center gap-x-4">
      {row.original.drops.map(d => <div key={d.itemId}><TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger className="block pt-1">
            <ItemSprite
              className="border-2 shadow-sm border-slate-200 bg-slate-50 rounded-sm"
              url={d.item.spriteUrl}
              name={d.item.name}
              size="md"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
          <p>{d.item.name}</p>
        </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="text-sm pt-1 px-1 flex items-center space-x-1">
        <div>
        {d.item.sellPrice}  
        </div>
        <UnitSprite type="coin" />
      </div>
      </div>
)}
    </div>,
  }),
]

export function MobTable() {

  const [sorting, setSorting] = useState<SortingState>([
    {id: 'level', desc: false}
  ])

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  const { data } = api.mob.getAll.useQuery();

  const table = useReactTable({
    data: data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })



  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-8">
        <DebouncedInput
          placeholder="Filter by mob or item..."
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          className="max-w-sm"
        />
        <div className="flex items-center space-x-2">
          <Checkbox id="bosses"
            checked={Boolean(table.getColumn('boss')?.getFilterValue())}
            onCheckedChange={(c) => table.getColumn('boss')?.setFilterValue(Boolean(c))}
          />
          <label
            htmlFor="bosses"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Bosses
          </label>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} style={{
                      width: header.getSize(),
                    }}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (<TableCell key={cell.id}
                            className={cn(cell.column.id === 'sprite' && 'py-0', 'text-lg')}
                            style={{
                              width: cell.column.getSize(),
                            }}
                            >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>)
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
