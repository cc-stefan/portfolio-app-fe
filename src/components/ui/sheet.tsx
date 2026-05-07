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
      className={cn(
        'fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        className
      )}
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
            'surface-card fixed inset-y-3 right-3 z-50 flex w-[min(92vw,25rem)] flex-col rounded-2xl p-5',
            'data-[state=closed]:animate-out data-[state=open]:animate-in',
            'data-[state=closed]:slide-out-to-right-8 data-[state=open]:slide-in-from-right-8',
          ],
          className
        )}
        {...props}
      >
        {children}
        <Dialog.Close className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/45">
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
