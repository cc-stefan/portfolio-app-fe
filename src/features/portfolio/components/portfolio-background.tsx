export function PortfolioBackground() {
  return (
    <>
      <div className="pointer-events-none absolute left-[-10rem] top-16 -z-10 size-[26rem] rounded-full bg-[color:var(--primary)]/16 blur-3xl animate-[drift_16s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute right-[-6rem] top-40 -z-10 hidden size-[24rem] rounded-full bg-[color:var(--accent)]/20 blur-3xl sm:block animate-[drift_20s_ease-in-out_infinite]" />
    </>
  );
}
