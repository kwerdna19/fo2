"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "~/utils/styles"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu"
import { UnitSprite } from "../UnitSprite"
import { usePathname } from "next/navigation"
import { type RouterOutputs } from "~/trpc/shared"

export function Header({ areas }: { areas: RouterOutputs['area']['getAllQuick'] }) {

  const path = usePathname()

  const pathMatches = (str: string) => path === str

  return (
    <div className="flex gap-x-4 items-center">
      <Link href="/" className="flex gap-x-4 items-center">
        <UnitSprite type="gem" size="lg" />
        <h1>FO2 DB</h1>
      </Link>
      <div className="pl-2 my-2 border-r-2 self-stretch" />
      <div className="flex-1">
      <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink active={pathMatches('/mobs')} asChild className={navigationMenuTriggerStyle()}>
            <Link href="/mobs">
              Mobs
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink active={pathMatches('/items')} asChild className={navigationMenuTriggerStyle()}>
            <Link href="/items">
              Items
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink active={pathMatches('/npcs')} asChild className={navigationMenuTriggerStyle()}>
            <Link href="/npcs">
              Npcs
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <NavigationMenuTrigger>
              <Link href="/areas">
                Areas
              </Link>
            </NavigationMenuTrigger>
          </NavigationMenuLink>
          <NavigationMenuContent>
            <ul className="gap-3 p-3 md:w-[300px] lg:w-[400px]">
              <ListItem href="/areas" title="World Map">
                Full interactive world map.
              </ListItem>
              <hr className="my-2"/>
              {areas.map(area => <ListItem key={area.id} href={`/areas/${area.slug}`} title={area.name}>{area.note}</ListItem>)}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink active={pathMatches('/builds')} asChild className={navigationMenuTriggerStyle()}>
            <Link href="/max-builds">
              Max Builds
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

      </NavigationMenuList>
    </NavigationMenu>
      </div>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  Omit<React.ComponentPropsWithoutRef<"a">, 'href'> & { href: string }
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          {children ? <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p> : null}
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
