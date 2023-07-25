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
import { MobSprite } from "../../MobSprite"
import { cn } from "~/utils/styles"
import { DebouncedInput } from "../../DebouncedInput"
import { Checkbox } from "../../ui/checkbox"
import Link from "next/link";
import { DropsList } from "./DropsList";
import { DropGold } from "./DropGold";
import { MobHealth } from "./MobHealth";


export type Datum = RouterOutputs['mob']['getAll'][number]
const columnHelper = createColumnHelper<Datum>()

export const columns = [
  columnHelper.accessor('level', {
    id: 'level',
    cell: ({ getValue }) => <div className="flex justify-center">{getValue()}</div>,
    header: ({ column }) => {
      const sort = column.getIsSorted()
      return (
        <div className="flex">
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
  columnHelper.display({
    id: 'sprite',
    cell: ({ row }) => <Link href={`/mobs/${row.original.name.replace(/ /g, '-').toLowerCase()}`} className="flex justify-center">
      <MobSprite url={row.original.spriteUrl} name={row.original.name} size="sm" />
    </Link>
  }),
  columnHelper.accessor('name', {
    cell: info => <Link href={`/mobs/${info.getValue().replace(/ /g, '-').toLowerCase()}`}>{info.getValue()}</Link>,
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
    },
    // size: 10
  }),
  columnHelper.accessor('boss', {
    header: () => null,
    cell: ({ row }) => row.original.boss ? <div className="flex justify-center"><Crown className="h-5 w-5 text-yellow-600" /></div> : '',
  }),
  columnHelper.accessor(row => (row.goldMin+row.goldMax)/2, {
    id: 'gold',
    cell: ({ row }) => <DropGold className="justify-center" goldMin={row.original.goldMin} goldMax={row.original.goldMax} />,
    header: ({ column }) => {
      const sort = column.getIsSorted()
      return (
        <div className="flex justify-center">
                  <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
        >
          Gold
          {sort ? (sort === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />) : null}
          
        </Button>
        </div>
      )
    }
  }),
  columnHelper.accessor('health', {
    cell: info => <MobHealth health={info.getValue()} />,
    header: ({ column }) => {
      const sort = column.getIsSorted()
      return (
        <div className="flex justify-center">
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
        >
          Health
          {sort ? (sort === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />) : null}
          
        </Button>
        </div>
      )
    },
  }),
  columnHelper.accessor(row => row.drops.map(d => d.item.name).join(', '), {
    id: 'loot',
    header: 'Loot',
    cell: ({ row }) => <DropsList drops={row.original.drops} /> //className="hidden lg:flex"
  }),
]

const renderExpandedRow = ({row}: { row: Row<Datum> }) => {
  return (
    <div className="text-lg flex items-center gap-x-12 flex-wrap justify-between">
      <div className="p-3 flex gap-x-8">
        <DropGold goldMin={row.original.goldMin} goldMax={row.original.goldMax} />
        <MobHealth health={row.original.health} />
      </div>
      <DropsList drops={row.original.drops} />
    </div>
  )
}


export function MobTable({ data }: { data: RouterOutputs['mob']['getAll']}) {

  const [sorting, setSorting] = useState<SortingState>([])

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  const [expanded, setExpanded] = useState<ExpandedState>({})

  const table = useReactTable({
    data: data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowCanExpand: () => true,
    state: {
      expanded,
      sorting,
      columnFilters,
      globalFilter,
    },
  })


  const hideOnSmall = ['loot', 'health', 'gold']

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
                    <TableHead className={cn(hideOnSmall.includes(header.id) && "hidden lg:table-cell")} colSpan={header.id === 'level' ? 2 : undefined} key={header.id}>
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
                  <TableRow aria-expanded={row.getIsExpanded()} className="relative aria-expanded:border-b-0 lg:aria-expanded:border-b" onClick={row.getToggleExpandedHandler()}>
                  {row.getVisibleCells().map((cell) => {
                    return (<TableCell key={cell.id}
                      className={cn('py-2 px-4', cell.column.id === 'sprite' && 'p-0', 'text-lg', hideOnSmall.includes(cell.column.id) && "p-0 lg:px-2 lg:py-3")}
                    >
                        <div
                          className={cn('text-lg', hideOnSmall.includes(cell.column.id) && "hidden lg:block")}
                        >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                        </div>
                      </TableCell>)
                  })}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow className="table-row lg:hidden hover:bg-inherit">
                    <TableCell className="pt-0" colSpan={row.getVisibleCells().length}>
                      {renderExpandedRow({ row })}
                    </TableCell>
                  </TableRow>
                )}
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
