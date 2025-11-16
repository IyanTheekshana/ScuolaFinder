// Minimal shadcn-like Button using Tailwind
export default function Button({ className = "", children, ...props }) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium " +
        "bg-black text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black " +
        className
      }
      {...props}
    >
      {children}
    </button>
  );
}
