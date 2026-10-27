import { useState, lazy, Suspense } from "react";
import ErrorBoundary from "./components/common/ErrorBoundary";

const HomePage = lazy(() => import("./pages/HomePage"));

export default function App() {
  const [currentPage, setCurrentPage] = useState("home"); // 'home' | 'about' | 'login'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // მომხმარებლის ავტორიზაციის State
  const [currentUser, setCurrentUser] = useState(null);
  const [customNameInput, setCustomNameInput] = useState("");

  // სისტემური დიაგნოსტიკის პანელი (ტესტირებისთვის)
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [simulateError, setSimulateError] = useState(false);
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error(
      "სიმულირებული კრიტიკული შეცდომა Error Boundary-ის დასატესტად!",
    );
  }

  // ავტორიზაციის ლოგიკა დინამიური სახელითა და როლით
  const handleLogin = (role) => {
    const defaultNames = {
      patient: "ელენე ლაბარტყავა",
      doctor: "დოქტ. დავით ბერიძე",
      admin: "სისტემის ადმინისტრატორი",
    };

    const finalName = customNameInput.trim() || defaultNames[role];

    const rolesData = {
      patient: { name: finalName, role: "patient", label: "პაციენტი" },
      doctor: { name: finalName, role: "doctor", label: "ექიმი" },
      admin: { name: finalName, role: "admin", label: "ადმინისტრატორი" },
    };

    setCurrentUser(rolesData[role]);
    setCurrentPage("home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCustomNameInput("");
    setCurrentPage("home");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 font-sans">
      {/* მთავარი ნავიგაცია */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPage("home")}
              className="text-2xl font-black text-sky-600 tracking-tight flex items-center gap-1.5 focus:outline-none"
            >
              <span>🏥</span> MediCare Hub
            </button>
            {currentUser && (
              <span className="hidden sm:inline-block text-xs bg-sky-50 text-sky-700 border border-sky-200 px-3 py-1 rounded-full font-medium">
                {currentUser.label}: <strong>{currentUser.name}</strong>
              </span>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => setCurrentPage("home")}
              className={`hover:text-sky-600 transition ${
                currentPage === "home"
                  ? "text-sky-600 border-b-2 border-sky-600 pb-0.5"
                  : ""
              }`}
            >
              მთავარი
            </button>
            <button
              onClick={() => setCurrentPage("about")}
              className={`hover:text-sky-600 transition ${
                currentPage === "about"
                  ? "text-sky-600 border-b-2 border-sky-600 pb-0.5"
                  : ""
              }`}
            >
              ჩვენ შესახებ
            </button>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-normal">
                  {currentUser.label}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition"
                >
                  გამოსვლა
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentPage("login")}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition font-medium shadow-sm flex items-center gap-2"
              >
                <span>🔐</span> შესვლა
              </button>
            )}
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

        {/* მობილური მენიუ */}
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
            {currentUser ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-rose-600 text-sm font-semibold hover:bg-rose-50 rounded-lg"
              >
                გამოსვლა ({currentUser.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setCurrentPage("login");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-sky-600 text-white rounded-lg text-sm font-medium hover:bg-sky-700"
              >
                შესვლა სისტემაში
              </button>
            )}
          </nav>
        )}
      </header>

      {/* ძირითადი ხედები */}
      <div className="flex-1">
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="flex justify-center items-center py-20 text-slate-500 text-sm">
                იტვირთება გვერდი...
              </div>
            }
          >
            {/* 1. ავტორიზაციის გვერდი */}
            {currentPage === "login" && (
              <div className="max-w-md mx-auto py-12 px-4">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xl">
                  <div className="text-center mb-6">
                    <span className="text-3xl">🔐</span>
                    <h1 className="text-xl font-bold text-slate-900 mt-2">
                      ავტორიზაცია პორტალზე
                    </h1>
                    <p className="text-xs text-slate-500 mt-1">
                      მიუთითეთ თქვენი სახელი და აირჩიეთ სამუშაო სივრცე:
                    </p>
                  </div>

                  {/* ინდივიდუალური სახელის შეყვანის ველი */}
                  <div className="mb-5 text-left">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      თქვენი სახელი და გვარი:
                    </label>
                    <input
                      type="text"
                      placeholder="მაგ: ელენე ლაბარტყავა"
                      value={customNameInput}
                      onChange={(e) => setCustomNameInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      * თუ ცარიელს დატოვებთ, ჩაჯდება ნაგულისხმევი სახელი.
                    </span>
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleLogin("patient")}
                      className="w-full p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-left transition flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-sky-700">
                          🧑‍💼 პაციენტის სივრცე
                        </div>
                        <div className="text-xs text-slate-500">
                          ექიმების მოძიება, ფილტრაცია და ვიზიტის დაჯავშნა
                        </div>
                      </div>
                      <span className="text-slate-400 group-hover:text-sky-600 font-bold">
                        →
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLogin("doctor")}
                      className="w-full p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-left transition flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-sky-700">
                          👨‍⚕️ ექიმის სამუშაო კაბინეტი
                        </div>
                        <div className="text-xs text-slate-500">
                          სამუშაო განრიგი და ჩაწერილი პაციენტების სია
                        </div>
                      </div>
                      <span className="text-slate-400 group-hover:text-sky-600 font-bold">
                        →
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLogin("admin")}
                      className="w-full p-4 rounded-xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50 text-left transition flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-sky-700">
                          ⚙️ ადმინისტრატორის პანელი
                        </div>
                        <div className="text-xs text-slate-500">
                          პერსონალის მართვა და ახალი ექიმის დამატება
                        </div>
                      </div>
                      <span className="text-slate-400 group-hover:text-sky-600 font-bold">
                        →
                      </span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage("home")}
                    className="mt-6 w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold text-center block"
                  >
                    ← დაბრუნება მთავარ გვერდზე
                  </button>
                </div>
              </div>
            )}

            {/* 2. მთავარი გვერდი: სტუმრის ვიტრინა (Landing) VS ავტორიზებული პორტალი */}
            {currentPage === "home" &&
              (currentUser ? (
                <HomePage
                  currentRole={currentUser.role}
                  currentUser={currentUser}
                  simulateError={simulateError}
                />
              ) : (
                <div className="max-w-6xl mx-auto px-4 py-12">
                  <section className="text-center py-12 sm:py-16 bg-linear-to-b from-sky-50/70 to-white rounded-3xl border border-sky-100 p-6 sm:p-12 mb-12 shadow-sm">
                    <span className="bg-sky-100 text-sky-800 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wider">
                      ინოვაციური ჯანდაცვის პლატფორმა
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mt-4 mb-4 tracking-tight leading-tight">
                      დაჯავშნე ვიზიტი საუკეთესო{" "}
                      <br className="hidden sm:inline" /> სამედიცინო
                      სპეციალისტებთან
                    </h1>
                    <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto mb-8">
                      MediCare Hub გაძლევთ საშუალებას რეალურ დროში იპოვოთ
                      კვალიფიციური ექიმი, ნახოთ თავისუფალი საათები და მართოთ
                      თქვენი ვიზიტები მარტივად.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={() => setCurrentPage("login")}
                        className="px-7 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
                      >
                        <span>🔐</span> გაიარეთ ავტორიზაცია ჯავშნისთვის
                      </button>
                      <button
                        onClick={() => setCurrentPage("about")}
                        className="px-7 py-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition"
                      >
                        გაიგეთ მეტი ჩვენ შესახებ
                      </button>
                    </div>
                  </section>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-3xl mb-3">⚡</div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">
                        სწრაფი ონლაინ ჯავშანი
                      </h3>
                      <p className="text-xs text-slate-500">
                        დაემშვიდობეთ რიგებსა და სატელეფონო ლოდინს. აირჩიეთ
                        სასურველი საათი ერთი კლიკით.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-3xl mb-3">🩺</div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">
                        ვერიფიცირებული ექიმები
                      </h3>
                      <p className="text-xs text-slate-500">
                        მხოლოდ სერტიფიცირებული, მრავალწლიანი გამოცდილების მქონე
                        წამყვანი სპეციალისტები.
                      </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="text-3xl mb-3">🛡️</div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">
                        დაცული სამედიცინო პროფილი
                      </h3>
                      <p className="text-xs text-slate-500">
                        თქვენი პირადი მონაცემები და ჯავშნის ისტორია სრულად
                        დაცულია პლატფორმის მიერ.
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            {/* 3. ჩვენ შესახებ გვერდი */}
            {currentPage === "about" && (
              <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                    ინოვაციური ჯანდაცვა თითოეული ოჯახისთვის
                  </h1>
                  <p className="text-slate-600 text-sm sm:text-base">
                    MediCare Hub აერთიანებს წამყვან ქართველ სპეციალისტებს ერთიან
                    ციფრულ სივრცეში, რათა სამედიცინო მომსახურება იყოს
                    ხელმისაწვდომი, სწრაფი და გამჭვირვალე.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                    <div className="text-3xl mb-2">⭐</div>
                    <div className="text-2xl font-black text-sky-600 mb-1">
                      98.4%
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">
                      კმაყოფილი პაციენტი
                    </h3>
                    <p className="text-xs text-slate-500">
                      ათასობით წარმატებით დასრულებული ვიზიტი და კონსულტაცია.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                    <div className="text-3xl mb-2">👨‍⚕️</div>
                    <div className="text-2xl font-black text-sky-600 mb-1">
                      40+
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">
                      სერტიფიცირებული ექიმი
                    </h3>
                    <p className="text-xs text-slate-500">
                      მრავალწლიანი კლინიკური გამოცდილების მქონე სპეციალისტები.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="text-2xl font-black text-sky-600 mb-1">
                      24/7
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm mb-1">
                      ონლაინ მხარდაჭერა
                    </h3>
                    <p className="text-xs text-slate-500">
                      ოპერატიული დახმარება და კონსულტაციის დაჯავშნა ნებისმიერ
                      დროს.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Suspense>
        </ErrorBoundary>
      </div>

      {/* სისტემური დიაგნოსტიკის პანელი (ლექტორის ტესტებისთვის) */}
      <aside className="fixed bottom-4 right-4 z-50">
        <button
          type="button"
          onClick={() => setShowDevPanel(!showDevPanel)}
          className="bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-xl hover:bg-slate-800 transition flex items-center gap-2 border border-slate-700"
        >
          <span>🛠️</span> სისტემური დიაგნოსტიკა {showDevPanel ? "▼" : "▲"}
        </button>

        {showDevPanel && (
          <div className="mt-2 p-3 bg-white border border-slate-300 rounded-xl shadow-2xl flex flex-col gap-2 text-xs w-64 animate-fade-in">
            <span className="font-bold text-slate-700 border-b pb-1">
              ტესტირების რეჟიმები:
            </span>
            <button
              type="button"
              onClick={() => setSimulateError(!simulateError)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition text-left ${
                simulateError
                  ? "bg-amber-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {simulateError
                ? "სერვერი გათიშულია (500)"
                : "გათიშე სერვერი (API 500)"}
            </button>
            <button
              type="button"
              onClick={() => setShouldCrash(true)}
              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition text-left"
            >
              Runtime შეცდომა (Crash UI)
            </button>
          </div>
        )}
      </aside>

      <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 MediCare Hub. ყველა უფლება დაცულია.</p>
          <p>თბილისი, საქართველო | ცხელი ხაზი: 032 2 00 00 00</p>
        </div>
      </footer>
    </div>
  );
}
