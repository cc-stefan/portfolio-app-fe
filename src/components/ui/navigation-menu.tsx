"use client";

import * as React from "react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function NavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cn("relative flex max-w-max flex-1 items-center", className)}
      {...props}
    >
      {children}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn("flex list-none items-center gap-1", className)}
      {...props}
    />
  );
}

const NavigationMenuItem = NavigationMenuPrimitive.Item;

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45",
        className,
      )}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
};
