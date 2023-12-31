import { type ReactNode } from 'react'
import { Button } from './ui/button'
import { type Column } from '@tanstack/react-table'
import { TbArrowDown as ArrowDown, TbArrowUp as ArrowUp } from "react-icons/tb";


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SortButton({ children, column }: { children: ReactNode, column: Column<any> }) {
  const sort = column.getIsSorted()
  return (<Button
    variant="ghost"
    onClick={() => column.toggleSorting()}
    >
    {children}
    {sort ? (sort === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />) : null}
    </Button>)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSortButton = (label: string) => function SortButtonWithLabel({ column }: { column: Column<any> }) {
  return (
    <SortButton column={column}>
      {label}
    </SortButton>
  )
}