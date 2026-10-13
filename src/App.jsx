import { useState } from "react";
import HomePage from "./pages/HomePage";
import ErrorBoundary from "./components/common/ErrorBoundary";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-sky-600 tracking-tight">
              MediCare Hub
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => setCurrentPage("home")}
              className={`hover:text-sky-600 transition ${
                currentPage === "home" ? "text-sky-600" : ""
              }`}
            >
              მთავარი
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className={`hover:text-sky-600 transition ${
                currentPage === "about" ? "text-sky-600" : ""
              }`}
            >
              ჩვენ შესახებ
            </button>
            <button className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition font-medium">
              შესვლა
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
            aria-label="მენიუს გახსნა"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg">
            <button
              onClick={() => {
                setCurrentPage("home");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-700"
            >
              მთავარი
            </button>
            <button
              onClick={() => {
                setCurrentPage("about");
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 text-slate-700"
            >
              ჩვენ შესახებ
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700"
            >
              შესვლა
            </button>
          </nav>
        )}
      </header>

      {/* Error Boundary-ით შეფუთული მთავარი შინაარსი */}
      <div className="flex-1">
        <ErrorBoundary>
          {currentPage === "home" ? (
            <HomePage />
          ) : (
            <div className="max-w-4xl mx-auto py-16 px-4 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                ჩვენ შესახებ
              </h2>
              <p className="text-slate-600">
                MediCare Hub – თქვენი სანდო სამედიცინო პარტნიორი.
              </p>
            </div>
          )}
        </ErrorBoundary>
      </div>

      <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MediCare Hub. ყველა უფლება დაცულია.</p>
          <p>თბილისი, საქართველო | info@medicarehub.ge</p>
        </div>
      </footer>
    </div>
  );
}
