import Link from "next/link"
import { type ReactNode } from "react"
import { cn } from "~/utils/styles"

interface Props {
  image: ReactNode,
  label: string,
  className?: string
  href: string
}

export default function NavCard({ image, label, className, href }: Props) {


  return <Link href={href} className={cn("max-w-md w-full flex border-2 rounded-lg items-center p-2 h-[100px]", className)}>
    <div className="flex-0 min-w-[80px]">
      {image}
    </div>
    <div className="flex-1 px-3 text-3xl">
      {label}
    </div>
  </Link>
}