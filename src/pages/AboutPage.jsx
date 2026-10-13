export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4">
          ჩვენ შესახებ
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          MediCare Hub წარმოადგენს ინოვაციურ სამედიცინო პლატფორმას, რომლის
          მიზანია ჯანდაცვის სერვისების გამარტივება.
        </p>
      </section>

      <article className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm mb-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          ჩვენი მისია და შექმნის ისტორია
        </h2>
        <p className="text-slate-600 leading-relaxed">
          პლატფორმის განვითარება დაიწყო{" "}
          <time dateTime="2026-02-01">2026 წლის თებერვალში</time>. ჩვენი გუნდის
          მიზანია აღმოვფხვრათ ხანგრძლივი რიგები კლინიკებში და პაციენტებს მივცეთ
          სრული ინფორმაცია ექიმების კვალიფიკაციის შესახებ.
        </p>

        <figure className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">🏥 🩺 🤝</div>
          <figcaption className="text-xs text-slate-500">
            MediCare Hub - პაციენტზე ორიენტირებული ციფრული ეკოსისტემა
          </figcaption>
        </figure>
      </article>

      <aside
        aria-label="ძირითადი მიღწევები"
        className="bg-sky-50 border border-sky-100 rounded-xl p-6"
      >
        <h2 className="text-base font-bold text-sky-900 mb-4">
          პლატფორმის მონაცემები
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <li className="bg-white p-4 rounded-lg shadow-sm">
            <strong className="block text-2xl font-bold text-sky-600">
              50+
            </strong>
            <span className="text-xs text-slate-600">
              სერტიფიცირებული ექიმი
            </span>
          </li>
          <li className="bg-white p-4 rounded-lg shadow-sm">
            <strong className="block text-2xl font-bold text-sky-600">
              10 000+
            </strong>
            <span className="text-xs text-slate-600">დაჯავშნილი ვიზიტი</span>
          </li>
          <li className="bg-white p-4 rounded-lg shadow-sm">
            <strong className="block text-2xl font-bold text-sky-600">
              99%
            </strong>
            <span className="text-xs text-slate-600">
              კმაყოფილი მომხმარებელი
            </span>
          </li>
        </ul>
      </aside>
    </main>
  );
}
