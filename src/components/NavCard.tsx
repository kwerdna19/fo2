import Link from "next/link"
import { type ReactNode } from "react"
import { cn } from "~/utils/styles"
import { Button } from "./ui/button"

interface Props {
  image: ReactNode,
  label: string,
  className?: string
  href: string
}

export default function NavCard({ image, label, className, href }: Props) {


  return <Button className={cn("max-w-md w-full h-24", className)} variant="outline" asChild>
    <Link prefetch={false} href={href}>
      <div className="flex-0 min-w-[80px]">
        {image}
      </div>
      <div className="flex-1 px-3 text-3xl">
        {label}
      </div>
    </Link>
  </Button>
}