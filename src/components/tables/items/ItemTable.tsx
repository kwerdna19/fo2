'use client'

import {
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  getExpandedRowModel,
} from "@tanstack/react-table"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { type RouterOutputs } from "~/utils/api"
import { DebouncedInput } from "../../DebouncedInput"
import Link from "next/link";
import { ItemSprite } from "~/components/ItemSprite";
import { getSortButton } from "~/components/SortButton";
import { GoldCount } from "~/components/GoldCount"
import { DroppedByList } from "./DroppedByList"
import { cn } from "~/utils/styles"
import { type Item } from "@prisma/client"


type Data = RouterOutputs['item']['getAll']
export type Datum = Data[number]
const columnHelper = createColumnHelper<Datum>()

function ItemStats(props: { stats: Pick<Item, 'str' | 'agi' | 'armor' | 'int' | 'sta'>, className?: string }) {


  const { className, stats: inputItem } = props

  const armor = inputItem.armor

  const stats = (['str', 'agi', 'int', 'sta'] as const).filter(s => inputItem[s] !== null).map(s => {
    return {
      stat: s.toUpperCase(),
      value: inputItem[s]!
    }
  })
  //.sort((a, b) => b.value - a.value)


  if(stats.length === 0 && !armor) {
    return null
  }

  return (<div className={cn(className, "text-sm")}>
    {stats.length > 0 ? <div className="bg-slate-200 w-16 space-y-1.5 rounded-md p-1 mb-1">
      {stats.map(({ stat, value }) => {
            return (<div key={stat} className="flex justify-between">
            <div className="bg-slate-300 w-6 text-center rounded-sm">{value > 0 ? `+${value}` : value}</div>
            <div className="flex-1 text-center pl-1">{stat}</div>
        </div>)
      })}
    </div> : null}
    {armor ? <div className="p-1"><span>{armor > 0 ? `+${armor}` : armor}</span> <span>Armor</span></div> : null}
  </div>)

}

export const columns = [
  columnHelper.display({
    id: 'sprite',
    header: () => null,
    cell: ({ row }) => <Link href={`/items/${row.original.slug}`} className="flex justify-center">
      <ItemSprite url={row.original.spriteUrl} name={row.original.name} size="md" className="border-2 shadow-sm border-slate-200 bg-slate-50 rounded-sm" />
    </Link>
  }),
  columnHelper.accessor('name', {
    cell: info => <Link href={`/items/${info.row.original.slug}`}>{info.getValue()}</Link>,
    header: getSortButton('Name'),
  }),
  columnHelper.accessor('levelReq', {
    header: getSortButton('Level Req')
  }),
  columnHelper.display({
    id: 'stats',
    header: 'Stats',
    cell: ({ row }) => <ItemStats stats={row.original} />
  }),
  columnHelper.accessor('sellPrice', {
    header: getSortButton('Sell Price'),
    cell: info => <GoldCount count={info.getValue()} />,
  }),
  columnHelper.accessor(row => row.droppedBy.map(d => d.mob.name).join(', '), {
    id: 'dropped-by',
    header: 'Dropped By',
    cell: ({ row }) => <DroppedByList mobs={row.original.droppedBy}  />
  })
]


export function ItemTable({ data }: { data: Data }) {

  const [sorting, setSorting] = useState<SortingState>([])

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data: data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowCanExpand: () => true,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center mb-4 gap-8">
        <DebouncedInput
          placeholder="Filter by mob or item..."
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
              table.getRowModel().rows.map((row) => {
                return (<TableRow key={row.id} aria-expanded={row.getIsExpanded()} onClick={row.getToggleExpandedHandler()}>
                  {row.getVisibleCells().map((cell) => {
                    return (<TableCell key={cell.id}
                      className={cn("text-lg", cell.column.id === 'dropped-by' && 'p-0')}
                    >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                    </TableCell>)
                  })}
                </TableRow>)
              })
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
