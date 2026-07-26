'use client';

import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '@/lib/utils';

export function Tabs(props: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" {...props} />;
}

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'inline-flex w-full items-center gap-1 rounded-lg border border-border bg-secondary/74 p-1 shadow-sm backdrop-blur-md sm:w-auto',
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        [
          'inline-flex h-9 flex-1 items-center justify-center rounded-md px-3.5 text-sm font-semibold text-muted-foreground sm:flex-none',
          'transition-[background-color,color,box-shadow] duration-200 outline-none',
          'focus-visible:ring-4 focus-visible:ring-ring/45',
          'data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        ],
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'outline-none data-[state=active]:animate-in data-[state=active]:fade-in-50',
        className
      )}
      {...props}
    />
  );
}
