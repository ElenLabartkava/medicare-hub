import { useState, useEffect } from "react";
import CardTemp from "../components/common/CardTemp";
import Modal from "../components/common/Modal";
import DoctorForm from "../components/DoctorForm";
import { useDoctors } from "../hooks/useServices";

export default function HomePage() {
  const { doctors, loading, addDoctor, deleteDoctor } = useDoctors();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [bookedDoctor, setBookedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false); // აკორდეონი მობილურისთვის

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredDoctors = doctors.filter((doc) => {
    const term = debouncedTerm.toLowerCase();
    const nameMatch = doc.name?.toLowerCase().includes(term);
    const specMatch = doc.spec?.toLowerCase().includes(term);
    return nameMatch || specMatch;
  });

  const handleListClick = (event) => {
    const deleteBtn = event.target.closest("button[data-action='delete']");
    if (deleteBtn) {
      const docId = Number(deleteBtn.dataset.id);
      deleteDoctor(docId);
      return;
    }

    const bookBtn = event.target.closest("button[data-action='book']");
    if (bookBtn) {
      const doctorId = bookBtn.dataset.id;
      const doctorName = bookBtn.dataset.name;
      setBookedDoctor({ id: doctorId, name: doctorName });
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Modal Portal */}
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

      {/* Hero სექცია (Mobile-First) */}
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

      {/* Layout: Sidebar + List (Mobile-First: 1 col -> Tablet/Desktop: 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-4">
        {/* ფილტრების & მართვის პანელი */}
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

          {/* მობილურზე ფილტრების ჩამოსაშლელი ღილაკი (აკორდეონი) */}
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

          {/* ფილტრების შინაარსი: მობილურზე ჩაკეცილია თუ showFiltersMobile=false, დესკტოპზე ყოველთვის ჩანს */}
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
            filteredDoctors.map((doc) => (
              <CardTemp key={doc.id}>
                {/* მობილურზე ადაპტირებადი Flex განლაგება */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                  <div className="flex items-center gap-3.5">
                    <figure className="m-0 relative flex-shrink-0">
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
                        data-name={doc.name}
                        className="px-3.5 py-1.5 bg-sky-600 text-white text-xs font-semibold rounded-lg hover:bg-sky-700 transition"
                      >
                        დაჯავშნა
                      </button>
                      <button
                        type="button"
                        data-action="delete"
                        data-id={doc.id}
                        className="px-2.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition"
                        title="წაშლა"
                      >
                        წაშლა
                      </button>
                    </div>
                  </div>
                </div>
              </CardTemp>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
