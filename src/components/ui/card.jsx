export function Card({ className = "", children }) {
  return (
    <div
      className={
        "rounded-xl border border-white/40 bg-white/80 backdrop-blur-lg shadow-lg shadow-slate-900/5 transition duration-300 p-1 hover:-translate-y-0.5 hover:shadow-slate-900/10 " +
        className
      }
    >
      {children}
    </div>
  );
}
export function CardHeader({ className = "", children }) {
  return (
    <div className={"p-5 border-b border-slate-100 " + className}>
      {children}
    </div>
  );
}
export function CardContent({ className = "", children }) {
  return <div className={"p-5 " + className}>{children}</div>;
}
export function CardTitle({ className = "", children }) {
  return (
    <h3 className={"text-lg font-semibold text-slate-900 " + className}>
      {children}
    </h3>
  );
}
export function CardDescription({ className = "", children }) {
  return <p className={"text-sm text-slate-500 " + className}>{children}</p>;
}
