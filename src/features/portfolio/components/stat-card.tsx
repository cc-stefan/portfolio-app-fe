interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-black/8 bg-white/80 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-foreground/45">
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-foreground">
        {value}
      </p>
    </div>
  );
}
