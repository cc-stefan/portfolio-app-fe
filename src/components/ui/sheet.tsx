'use client';

import * as React from 'react';
import { Dialog } from 'radix-ui';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;
export const SheetPortal = Dialog.Portal;

export function SheetOverlay({ className, ...props }: React.ComponentProps<typeof Dialog.Overlay>) {
  return (
    <Dialog.Overlay
      data-slot="sheet-overlay"
      className={cn('sheet-overlay-motion fixed inset-0 z-50 bg-slate-950/48', className)}
      {...props}
    />
  );
}

export function SheetContent({
  className,
  children,
  closeLabel,
  ...props
}: React.ComponentProps<typeof Dialog.Content> & { closeLabel: string }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        data-slot="sheet-content"
        className={cn(
          [
            'safe-sheet sheet-panel-motion fixed z-50 flex flex-col overflow-y-auto rounded-xl border border-border p-5 shadow-[var(--surface-shadow-lg)]',
          ],
          className
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card/88 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45">
          <X className="size-4" />
          <span className="sr-only">{closeLabel}</span>
        </Dialog.Close>
      </Dialog.Content>
    </SheetPortal>
  );
}

export function SheetTitle({ className, ...props }: React.ComponentProps<typeof Dialog.Title>) {
  return (
    <Dialog.Title
      data-slot="sheet-title"
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof Dialog.Description>) {
  return (
    <Dialog.Description
      data-slot="sheet-description"
      className={cn('text-sm leading-6 text-muted-foreground', className)}
      {...props}
    />
  );
}
