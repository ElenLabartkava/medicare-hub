import { useState, useEffect } from "react";
import CardTemp from "../components/common/CardTemp";
import { useDoctors } from "../hooks/useServices";

export default function HomePage() {
  const { doctors, loading } = useDoctors();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [bookedDoctor, setBookedDoctor] = useState(null);

  // 1. Debouncing: 350ms დაყოვნება საძიებო ველზე
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. ექიმების გაფილტვრა დაყოვნებული მნიშვნელობით (Debounced Value)
  const filteredDoctors = doctors.filter((doc) => {
    const term = debouncedTerm.toLowerCase();
    const nameMatch = doc.name?.toLowerCase().includes(term);
    const specMatch = doc.spec?.toLowerCase().includes(term);
    return nameMatch || specMatch;
  });

  // 3. Event Delegation: ერთი დამმუშავებელი მშობელ კონტეინერზე
  const handleListClick = (event) => {
    const targetBtn = event.target.closest("button[data-action='book']");
    if (!targetBtn) return;

    const doctorId = targetBtn.dataset.id;
    const doctorName = targetBtn.dataset.name;
    setBookedDoctor({ id: doctorId, name: doctorName });
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* შეტყობინება წარმატებულ ჯავშანზე */}
      {bookedDoctor && (
        <div
          role="status"
          className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between"
        >
          <span>
            ჯავშანი წარმატებით დადასტურდა ექიმთან:{" "}
            <strong>{bookedDoctor.name}</strong>
          </span>
          <button
            type="button"
            onClick={() => setBookedDoctor(null)}
            className="text-xs bg-white border border-emerald-300 px-3 py-1 rounded-md hover:bg-emerald-100"
          >
            დახურვა
          </button>
        </div>
      )}

      {/* Hero სექცია */}
      <section className="text-center py-10 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
          იპოვე შენი პირადი ექიმი და დაჯავშნე ვიზიტი
        </h1>
        <p className="text-slate-600 mb-6">
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
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
          >
            ძებნა
          </button>
        </form>
      </section>

      {/* ძირითადი განლაგება */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start mt-8">
        <aside
          aria-label="ფილტრები"
          className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm"
        >
          <h2 className="text-lg font-bold text-slate-900 mb-4">ფილტრაცია</h2>
          <form className="space-y-4">
            <fieldset>
              <legend className="text-sm font-semibold text-slate-700 mb-2">
                სპეციალობა
              </legend>
              <div className="space-y-1 text-sm text-slate-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked /> ყველა
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> კარდიოლოგია
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" /> პედიატრია
                </label>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-slate-700 mb-1">
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
              className="w-full py-1.5 text-xs text-slate-600 border border-slate-300 rounded hover:bg-slate-50"
            >
              გასუფთავება
            </button>
          </form>
        </aside>

        {/* ექიმების სია Event Delegation კონტეინერით */}
        <section
          onClick={handleListClick}
          className="md:col-span-3 space-y-4"
          aria-label="ექიმების სია"
        >
          <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center justify-between">
            <span>ხელმისაწვდომი ექიმები</span>
            <span className="text-xs font-normal text-slate-500">
              სულ: {filteredDoctors.length}
            </span>
          </h2>

          {loading ? (
            <p className="text-slate-500">იტვირთება მონაცემები...</p>
          ) : filteredDoctors.length === 0 ? (
            <p className="text-slate-500 py-4">ექიმი ვერ მოიძებნა.</p>
          ) : (
            filteredDoctors.map((doc) => (
              <CardTemp key={doc.id}>
                <div className="flex items-center gap-4">
                  <figure className="m-0 relative">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-3xl border border-slate-200">
                      {doc.avatar}
                    </div>
                    {/* Pulse Loading / Status ინდიკატორი (GPU Keyframes) */}
                    <span
                      title="აქტიური ექიმი"
                      className="pulse-badge absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white"
                    />
                    <figcaption className="sr-only">
                      {doc.name} {doc.spec}
                    </figcaption>
                  </figure>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {doc.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {doc.spec} {doc.experience}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      უახლოესი თავისუფალი დრო:{" "}
                      <time dateTime={doc.nextSlot}>{doc.formattedDate}</time>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                  <span className="text-sm font-bold text-slate-900">
                    {doc.price}
                  </span>
                  <button
                    type="button"
                    data-action="book"
                    data-id={doc.id}
                    data-name={doc.name}
                    className="px-4 py-2 bg-sky-600 text-white text-xs font-semibold rounded-lg hover:bg-sky-700 transition"
                  >
                    ვიზიტის დაჯავშნა
                  </button>
                </div>
              </CardTemp>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
