import { memo } from "react";

function CardTemp({ children, className = "" }) {
  return (
    <article
      tabIndex={0}
      className={`interactive-card bg-white p-5 border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-500 ${className}`}
    >
      {children}
    </article>
  );
}

export default memo(CardTemp);
