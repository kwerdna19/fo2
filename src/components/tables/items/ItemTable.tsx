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
  type ExpandedState,
  type Row,
} from "@tanstack/react-table"
import { TbCrown as Crown, TbArrowDown as ArrowDown, TbArrowUp as ArrowUp } from "react-icons/tb";
import { Fragment, useState } from "react"
import { Button } from "~/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { type RouterOutputs } from "~/utils/api"
import { cn } from "~/utils/styles"
import { DebouncedInput } from "../../DebouncedInput"
import { Checkbox } from "../../ui/checkbox"
import Link from "next/link";
import { ItemSprite } from "~/components/ItemSprite";
import { getSortButton } from "~/components/SortButton";


type Data = RouterOutputs['item']['getAll']
type Datum = Data[number]
const columnHelper = createColumnHelper<Datum>()

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
    id: 'levelReq',
    // cant figure this out so nulls always on bottom
    // sortingFn: (a, b) => {
    //   if(a.original.levelReq === null || b.original.levelReq === null) {
    //     return 1
    //   }
    //   return (a.original.levelReq ?? 0) - (b.original.levelReq ?? 0)
    // },
    header: getSortButton('Level Req')
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
                      className="text-lg"
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
