export default function CardTemp({ children, className = "" }) {
  return (
    <article
      className={`bg-white p-5 border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {children}
    </article>
  );
}
