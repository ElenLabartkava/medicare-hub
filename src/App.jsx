import { useState } from "react";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* მთავარი ნავიგაცია და ჰედერი */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("home");
            }}
            className="text-2xl font-bold text-sky-600 hover:text-sky-700 transition"
          >
            MediCare Hub
          </a>

          <nav aria-label="მთავარი ნავიგაცია">
            <ul className="flex items-center gap-6 text-sm font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentPage("home")}
                  className={`transition ${currentPage === "home" ? "text-sky-600 font-semibold" : "text-slate-600 hover:text-slate-900"}`}
                >
                  მთავარი
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setCurrentPage("about")}
                  className={`transition ${currentPage === "about" ? "text-sky-600 font-semibold" : "text-slate-600 hover:text-slate-900"}`}
                >
                  ჩვენ შესახებ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition shadow-sm"
                >
                  შესვლა
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* გვერდის გამოჩენა */}
      <div className="flex-1">
        {currentPage === "home" ? <HomePage /> : <AboutPage />}
      </div>

      {/* საერთო ფუტერი */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-12 text-slate-600 text-sm">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <address className="not-italic text-xs text-slate-500">
            <p>
              კონტაქტი:{" "}
              <a
                href="mailto:info@medicarehub.ge"
                className="hover:underline text-sky-600"
              >
                info@medicarehub.ge
              </a>
            </p>
            <p>თბილისი, საქართველო</p>
          </address>
          <p className="text-xs text-slate-500">
            &copy; <time dateTime="2026">2026</time> MediCare Hub. ყველა უფლება
            დაცულია.
          </p>
        </div>
      </footer>
    </div>
  );
}
