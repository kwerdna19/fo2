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
import { MobSprite } from "../../MobSprite"
import { cn } from "~/utils/styles"
import { DebouncedInput } from "../../DebouncedInput"
import Link from "next/link";
import { getSortButton } from "~/components/SortButton";
import { SaleItemsList } from "./SaleItemsList";
import { type getAllNpcs } from "~/features/npcs/requests"
import { Badge } from "~/components/ui/badge"

type Data = Awaited<ReturnType<typeof getAllNpcs>>

export type Datum = Data[number]
const columnHelper = createColumnHelper<Datum>()

export const columns = [
  columnHelper.display({
    id: 'sprite',
    cell: ({ row }) => <Link prefetch={false} href={`/npcs/${row.original.slug}`} className="flex justify-center">
      <MobSprite url={row.original.spriteUrl} name={row.original.name} size="sm" className="pb-4 -mt-8" />
    </Link>
  }),
  columnHelper.accessor('name', {
    cell: info => <Link prefetch={false} href={`/npcs/${info.row.original.slug}`}>{info.getValue()}</Link>,
    header: getSortButton('Name')
  }),
  columnHelper.accessor('type', {
    cell: info => info.getValue(),
    header: getSortButton('Type')
  }),
  columnHelper.accessor(row => row.locations.map(l => l.area.name).join(','), {
    cell: ({ row }) => <div className="flex flex-wrap gap-3">
      {row.original.locations.map(({id, area}) => <Link prefetch={false} href={`/areas/${area.slug}?npcId=${row.original.id}`} key={id}><Badge>{area.name}</Badge></Link>)}
    </div>,
    header: 'Areas'
  }),
  columnHelper.display({
    id: 'sells',
    cell: ({ row }) => <SaleItemsList items={row.original.items}  />,
    header: 'Sells'
  }),
  columnHelper.display({
    id: 'crafts',
    cell: ({ row }) => <SaleItemsList items={row.original.crafts} infoInToolTip />,
    header: 'Crafts'
  }),
]


export function NpcTable({ data }: { data: Data }) {

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
          placeholder="Filter by name, item, or area..."
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
                return (<TableRow key={row.id} aria-expanded={row.getIsExpanded()} className="relative aria-expanded:border-b-0 lg:aria-expanded:border-b" onClick={row.getToggleExpandedHandler()}>
                  {row.getVisibleCells().map((cell) => {
                    return (<TableCell key={cell.id}
                      className={cn('py-2 px-4', 'text-lg')}
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
