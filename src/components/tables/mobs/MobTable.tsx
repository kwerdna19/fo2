'use client'

import {
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper
} from "@tanstack/react-table"
import { TbCrown as Crown } from "react-icons/tb";
import { Fragment, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { type RouterOutputs } from "~/trpc/shared"
import { MobSprite } from "../../MobSprite"
import { cn } from "~/utils/styles"
import { DebouncedInput } from "../../DebouncedInput"
import { Checkbox } from "../../ui/checkbox"
import Link from "next/link";
import { DropsList } from "./DropsList";
import { DropGold } from "./DropGold";
import { MobHealth } from "./MobHealth";
import SortButton, { getSortButton } from "~/components/SortButton";


export type Datum = RouterOutputs['mob']['getAll'][number]
const columnHelper = createColumnHelper<Datum>()

export const columns = [
  columnHelper.accessor('level', {
    id: 'level',
    cell: ({ getValue }) => <div className="flex justify-center">{getValue()}</div>,
    header: getSortButton('Level')
  }),
  columnHelper.display({
    id: 'sprite',
    cell: ({ row }) => <Link href={`/mobs/${row.original.slug}`} className="flex justify-center">
      <MobSprite url={row.original.spriteUrl} name={row.original.name} size="sm" />
    </Link>
  }),
  columnHelper.accessor('name', {
    cell: info => <Link href={`/mobs/${info.row.original.slug}`}>{info.getValue()}</Link>,
    header: getSortButton('Name')
  }),
  columnHelper.accessor('boss', {
    header: () => null,
    cell: ({ row }) => row.original.boss ? <div className="flex justify-center"><Crown className="h-5 w-5 text-yellow-600" /></div> : '',
  }),
  columnHelper.accessor(row => (row.goldMin+row.goldMax)/2, {
    id: 'gold',
    cell: ({ row }) => <DropGold className="justify-center" goldMin={row.original.goldMin} goldMax={row.original.goldMax} />,
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <SortButton column={column}>
            Gold
          </SortButton>
        </div>
      )
    }
  }),
  columnHelper.accessor('health', {
    cell: info => <MobHealth health={info.getValue()} />,
    header: ({ column }) => {
      return (
        <div className="flex justify-center">
          <SortButton column={column}>
            Health
          </SortButton>
        </div>
      )
    },
  }),
  columnHelper.accessor(row => row.drops.map(d => d.item.name).join(', '), {
    id: 'loot',
    header: 'Loot',
    cell: ({ row }) => <DropsList drops={row.original.drops} className="flex-nowrap" /> //className="hidden lg:flex"
  }),
]


export function MobTable({ data }: { data: RouterOutputs['mob']['getAll']}) {

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
                  if(header.id === 'sprite') {
                    return null
                  }
                  return (
                    <TableHead colSpan={header.id === 'level' ? 2 : undefined} key={header.id}>
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
                return (<Fragment key={row.id}>
                  <TableRow className="relative">
                  {row.getVisibleCells().map((cell) => {
                    return (<TableCell key={cell.id}
                      className={cn('py-2 px-4', cell.column.id === 'sprite' && 'p-0', 'text-lg')}
                    >
                        <div
                          className="text-lg"
                        >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                        </div>
                      </TableCell>)
                  })}
                </TableRow>
                </Fragment>
                )

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
