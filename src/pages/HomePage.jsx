import { useState, useEffect, useMemo, useCallback } from "react";
import CardTemp from "../components/common/CardTemp";
import Modal from "../components/common/Modal";
import DoctorForm from "../components/DoctorForm";
import { useDoctors } from "../hooks/useServices";

export default function HomePage() {
  const {
    doctors,
    loading,
    isOffline,
    simulateError,
    toggleSimulateError,
    addDoctor,
    deleteDoctor,
  } = useDoctors();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [bookedDoctor, setBookedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // თავდაცვითი პროგრამირება: Double-Click / Race Condition-ის დაბლოკვა
  const [bookingInProgressId, setBookingInProgressId] = useState(null);

  // Runtime Crash სიმულაცია Error Boundary-ის დასატესტად
  const [shouldCrash, setShouldCrash] = useState(false);
  if (shouldCrash) {
    throw new Error(
      "სიმულირებული კრიტიკული შეცდომა Error Boundary-ის დასატესტად!",
    );
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 1. ოპტიმიზაცია: useMemo ფილტრაციის მძიმე გამოთვლებისთვის
  const filteredDoctors = useMemo(() => {
    const term = debouncedTerm.toLowerCase();
    return doctors.filter((doc) => {
      const nameMatch = doc.name?.toLowerCase().includes(term);
      const specMatch = doc.spec?.toLowerCase().includes(term);
      return nameMatch || specMatch;
    });
  }, [doctors, debouncedTerm]);

  // 2. ოპტიმიზაცია: useCallback დაჯავშნის ლოგიკისთვის (ხელახალი რენდერების ასარიდებლად)
  const handleBook = useCallback(
    (doctor) => {
      if (bookingInProgressId) return;

      setBookingInProgressId(doctor.id);

      setTimeout(() => {
        setBookedDoctor(doctor);
        setBookingInProgressId(null);
      }, 700);
    },
    [bookingInProgressId],
  );

  // 3. ოპტიმიზაცია: useCallback სიის კლიკების დამმუშავებლისთვის
  const handleListClick = useCallback(
    (event) => {
      const deleteBtn = event.target.closest("button[data-action='delete']");
      if (deleteBtn) {
        const docId = Number(deleteBtn.dataset.id);
        deleteDoctor(docId);
        return;
      }

      const bookBtn = event.target.closest("button[data-action='book']");
      if (bookBtn) {
        const docId = Number(bookBtn.dataset.id);
        const targetDoc = doctors.find((d) => d.id === docId);
        if (targetDoc) {
          handleBook(targetDoc);
        }
      }
    },
    [deleteDoctor, doctors, handleBook],
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* ტესტირების პანელი ლექტორისთვის (დემო ღილაკები) */}
      <div className="mb-6 p-3 bg-slate-100 border border-slate-300 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-700">
          🛠️ დიაგნოსტიკის და ტესტირების რეჟიმი:
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleSimulateError}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              simulateError
                ? "bg-amber-600 text-white"
                : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {simulateError
              ? "სერვერის გათიშვა (აქტიური)"
              : "გათიშე სერვერი (API 500)"}
          </button>
          <button
            type="button"
            onClick={() => setShouldCrash(true)}
            className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition"
          >
            Runtime შეცდომის გამოწვევა (Crash UI)
          </button>
        </div>
      </div>

      {/* ოფლაინ / API Mock Fallback ინდიკატორი და კლინიკის ბანერი */}
      {isOffline && (
        <div
          role="alert"
          className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <strong>ნაჩვენებია ლოკალური დემო მონაცემები.</strong> სერვერთან
              კავშირი შეფერხებულია.
              <p className="text-xs text-amber-700 mt-0.5">
                დაუყოვნებელი ჯავშნისთვის დარეკეთ კლინიკის ცხელ ხაზზე:{" "}
                <strong>032 2 00 00 00</strong>
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-1 rounded w-fit">
            Offline Mode
          </span>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="ახალი ექიმის დამატება"
      >
        <DoctorForm
          onAddDoctor={addDoctor}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>

      {/* ჯავშნის შეტყობინება */}
      {bookedDoctor && (
        <div
          role="status"
          className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between text-sm"
        >
          <span>
            ჯავშანი წარმატებით დადასტურდა ექიმთან:{" "}
            <strong>{bookedDoctor.name}</strong>
          </span>
          <button
            type="button"
            onClick={() => setBookedDoctor(null)}
            className="text-xs bg-white border border-emerald-300 px-3 py-1 rounded-md hover:bg-emerald-100 font-semibold"
          >
            დახურვა
          </button>
        </div>
      )}

      {/* Hero სექცია */}
      <section className="text-center py-6 sm:py-10 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
          იპოვე შენი პირადი ექიმი და დაჯავშნე ვიზიტი
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mb-6">
          სწრაფი და სანდო ონლაინ ჯავშნები საუკეთესო სამედიცინო სპეციალისტებთან.
        </p>

        <form
          role="search"
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="search-input" className="sr-only">
            მოძებნეთ სპეციალობა ან ექიმი
          </label>
          <input
            id="search-input"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="მოძებნეთ სპეციალობა ან ექიმი..."
            className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition"
          >
            ძებნა
          </button>
        </form>
      </section>

      {/* ძირითადი განლაგება */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-4">
        {/* ფილტრები */}
        <aside
          aria-label="ფილტრები"
          className="bg-white p-4 sm:p-5 border border-slate-200 rounded-xl shadow-sm"
        >
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full mb-4 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-sm transition flex items-center justify-center gap-2 text-sm"
          >
            <span>+</span> ექიმის დამატება
          </button>

          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 border-t pt-3"
            >
              <span>ფილტრაცია {showFiltersMobile ? "▲" : "▼"}</span>
              <span className="text-xs text-sky-600 font-normal">
                {showFiltersMobile ? "ჩაკეცვა" : "გაშლა"}
              </span>
            </button>
          </div>

          <div
            className={`${
              showFiltersMobile ? "block" : "hidden"
            } lg:block space-y-4 pt-2`}
          >
            <h2 className="hidden lg:block text-base font-bold text-slate-900 mb-2">
              ფილტრაცია
            </h2>
            <form className="space-y-4">
              <fieldset>
                <legend className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                  სპეციალობა
                </legend>
                <div className="space-y-2 text-sm text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="accent-sky-600"
                    />{" "}
                    ყველა
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-sky-600" />{" "}
                    კარდიოლოგია
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-sky-600" />{" "}
                    პედიატრია
                  </label>
                </div>
              </fieldset>

              <fieldset>
                <legend className="text-xs font-semibold text-slate-700 mb-1 uppercase tracking-wider">
                  ფასის დიაპაზონი
                </legend>
                <input
                  type="range"
                  min="30"
                  max="150"
                  defaultValue="80"
                  className="w-full accent-sky-600"
                />
              </fieldset>

              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="w-full py-2 text-xs font-semibold text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
              >
                გასუფთავება
              </button>
            </form>
          </div>
        </aside>

        {/* ექიმების სია */}
        <section
          onClick={handleListClick}
          className="lg:col-span-3 space-y-4"
          aria-label="ექიმების სია"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              ხელმისაწვდომი ექიმები
            </h2>
            <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              სულ: {filteredDoctors.length}
            </span>
          </div>

          {loading ? (
            <p className="text-slate-500 text-sm">იტვირთება მონაცემები...</p>
          ) : filteredDoctors.length === 0 ? (
            <p className="text-slate-500 py-6 text-center bg-white rounded-xl border border-dashed border-slate-200">
              ექიმი ვერ მოიძებნა.
            </p>
          ) : (
            filteredDoctors.map((doc) => {
              const isBookingThis = bookingInProgressId === doc.id;

              return (
                <CardTemp key={doc.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-3.5">
                      <figure className="m-0 relative shrink-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-xl flex items-center justify-center text-2xl sm:text-3xl border border-slate-200">
                          {doc.avatar}
                        </div>
                        <span
                          title="აქტიური ექიმი"
                          className="pulse-badge absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"
                        />
                        <figcaption className="sr-only">
                          {doc.name} {doc.spec}
                        </figcaption>
                      </figure>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {doc.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600">
                          {doc.spec} • {doc.experience}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          უახლოესი დრო:{" "}
                          <time
                            dateTime={doc.nextSlot}
                            className="text-slate-600 font-medium"
                          >
                            {doc.formattedDate}
                          </time>
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 gap-2">
                      <span className="text-base font-black text-slate-900">
                        {doc.price}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          data-action="book"
                          data-id={doc.id}
                          disabled={Boolean(bookingInProgressId)}
                          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                            isBookingThis
                              ? "bg-sky-400 text-white cursor-not-allowed opacity-80"
                              : bookingInProgressId
                                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                                : "bg-sky-600 text-white hover:bg-sky-700"
                          }`}
                        >
                          {isBookingThis ? "მუშავდება..." : "დაჯავშნა"}
                        </button>
                        <button
                          type="button"
                          data-action="delete"
                          data-id={doc.id}
                          disabled={Boolean(bookingInProgressId)}
                          className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                          title="წაშლა"
                        >
                          წაშლა
                        </button>
                      </div>
                    </div>
                  </div>
                </CardTemp>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
