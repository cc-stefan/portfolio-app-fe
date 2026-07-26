import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function AdminFormField({
  label,
  description,
  error,
  children,
}: {
  label: string;
  description: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      <p className={cn('text-xs leading-5 text-muted-foreground', error && 'text-destructive')}>
        {error ?? description}
      </p>
    </div>
  );
}

export function AdminToggleField({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 rounded-xl border border-border bg-background/70 p-4">
      <input
        type="checkbox"
        className="mt-1 size-4 rounded border-border text-primary"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      <span>
        <span className="block text-sm font-medium text-foreground">{label}</span>
        <span className="mt-1 block text-sm leading-6 text-muted-foreground">{description}</span>
      </span>
    </label>
  );
}
