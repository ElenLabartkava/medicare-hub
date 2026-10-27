import { useState, useEffect, useMemo, useCallback } from "react";
import CardTemp from "../components/common/CardTemp";
import Modal from "../components/common/Modal";
import DoctorForm from "../components/DoctorForm";
import { useDoctors } from "../hooks/useServices";

export default function HomePage({
  currentRole = "patient",
  currentUser = null,
  simulateError = false,
}) {
  const {
    doctors,
    bookings,
    addBooking,
    loading,
    isOffline: hookOffline,
    addDoctor,
    deleteDoctor,
  } = useDoctors();

  const isOffline = hookOffline || simulateError;

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  // მოდალები
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null); // ექიმი, რომელსაც ვჯავშნით
  const [selectedDate, setSelectedDate] = useState("2026-10-28");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(null);

  // მობილური ფილტრი
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Debounce ძიებაზე
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // useMemo ფილტრაცია
  const filteredDoctors = useMemo(() => {
    const term = debouncedTerm.toLowerCase();
    return doctors.filter((doc) => {
      const nameMatch = doc.name?.toLowerCase().includes(term);
      const specMatch = doc.spec?.toLowerCase().includes(term);
      const categoryMatch =
        selectedSpecialty === "all" ||
        doc.category === selectedSpecialty ||
        doc.spec?.toLowerCase().includes(selectedSpecialty.toLowerCase());

      return (nameMatch || specMatch) && categoryMatch;
    });
  }, [doctors, debouncedTerm, selectedSpecialty]);

  // ჯავშნის ფანჯრის გახსნა
  const openBookingModal = useCallback((doctor) => {
    setBookingDoctor(doctor);
    setSelectedSlot(doctor.availableSlots?.[0] || "11:00");
  }, []);

  // ჯავშნის დადასტურება
  const confirmBooking = (e) => {
    e.preventDefault();
    if (!bookingDoctor || !selectedSlot) return;

    addBooking({
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      patientName: currentUser?.name || "გიორგი ნადარეიშვილი",
      date: selectedDate,
      time: selectedSlot,
      type: "ონლაინ ჯავშანი",
    });

    setBookingSuccessMsg(
      `ვიზიტი წარმატებით დაიჯავშნა ექიმთან: ${bookingDoctor.name} (${selectedDate}, ${selectedSlot})`,
    );
    setBookingDoctor(null);
  };

  // ექიმის როლისთვის განრიგის გაფილტვრა
  const doctorBookings = useMemo(() => {
    return bookings;
  }, [bookings]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8 font-sans">
      {/* ოფლაინ შეტყობინება */}
      {isOffline && (
        <div
          role="alert"
          className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 flex items-center justify-between text-sm shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <strong>ნაჩვენებია ლოკალური ქეშირებული მონაცემები.</strong>{" "}
              სერვერთან კავშირი შეფერხებულია.
            </div>
          </div>
          <span className="text-xs font-semibold uppercase bg-amber-200 text-amber-900 px-2.5 py-1 rounded">
            Offline Mode
          </span>
        </div>
      )}

      {/* ჯავშნის წარმატების შეტყობინება */}
      {bookingSuccessMsg && (
        <div
          role="status"
          className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between text-sm shadow-sm animate-fade-in"
        >
          <span>
            ✅ <strong>{bookingSuccessMsg}</strong>
          </span>
          <button
            type="button"
            onClick={() => setBookingSuccessMsg(null)}
            className="text-xs bg-white border border-emerald-300 px-3 py-1 rounded-md hover:bg-emerald-100 font-semibold"
          >
            დახურვა
          </button>
        </div>
      )}

      {/* 1. ადმინისტრატორის მართვის პანელი */}
      {currentRole === "admin" && (
        <div className="mb-8 p-6 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">
                მართვის პანელი
              </span>
              <h2 className="text-xl font-bold mt-1">
                კლინიკის ადმინისტრირება და ექიმები
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsDoctorModalOpen(true)}
              className="py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-sm transition shadow-sm flex items-center gap-2"
            >
              <span>+</span> ახალი ექიმის დამატება
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-800 text-xs text-slate-300">
            <div>
              აქტიური ექიმები:{" "}
              <strong className="text-white text-sm ml-1">
                {doctors.length}
              </strong>
            </div>
            <div>
              სულ ჯავშნები:{" "}
              <strong className="text-white text-sm ml-1">
                {bookings.length}
              </strong>
            </div>
            <div>
              სისტემის სტატუსი:{" "}
              <strong className="text-emerald-400 text-sm ml-1">აქტიური</strong>
            </div>
            <div>
              მონაცემთა ბაზა:{" "}
              <strong className="text-sky-400 text-sm ml-1">
                LocalStorage Sync
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* 2. ექიმის სამუშაო კაბინეტი (დინამიური ჯავშნებით) */}
      {currentRole === "doctor" && (
        <div className="mb-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                ექიმის სამუშაო სივრცე
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                დღევანდელი ვიზიტების განრიგი ({doctorBookings.length} ჩანაწერი)
              </h2>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs px-3 py-1 rounded-full font-semibold border border-emerald-200">
              კაბინეტი: #304
            </span>
          </div>

          <div className="space-y-3">
            {doctorBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 bg-slate-50 hover:bg-sky-50/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-200/80 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      ⏰ {b.time}
                    </span>
                    <strong className="text-slate-800 text-base">
                      {b.patientName}
                    </strong>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    თარიღი: {b.date} • ექიმი: {b.doctorName} • ტიპი: {b.type}
                  </p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 w-fit">
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* საძიებო Hero ბლოკი */}
      <section className="text-center py-6 sm:py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
          იპოვე შენი პირადი ექიმი და დაჯავშნე ვიზიტი
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mb-5">
          აირჩიე სპეციალისტი, ნახე თავისუფალი საათები და ჩაეწერე მარტივად.
        </p>

        <form
          role="search"
          className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="მოძებნეთ სპეციალობა ან ექიმის სახელი..."
            className="flex-1 px-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white shadow-sm"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-sky-600 text-white rounded-lg text-sm font-semibold hover:bg-sky-700 transition shadow-sm"
          >
            ძებნა
          </button>
        </form>
      </section>

      {/* ძირითადი ბადე: ფილტრები და ექიმები */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-4">
        {/* მარცხენა ფილტრი */}
        <aside className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
          {currentRole === "admin" && (
            <button
              type="button"
              onClick={() => setIsDoctorModalOpen(true)}
              className="w-full mb-4 py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-sm transition text-sm flex items-center justify-center gap-1.5"
            >
              <span>+</span> ექიმის დამატება
            </button>
          )}

          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800 border-t pt-3"
            >
              <span>მიმართულებები {showFiltersMobile ? "▲" : "▼"}</span>
            </button>
          </div>

          <div
            className={`${showFiltersMobile ? "block" : "hidden"} lg:block space-y-3 pt-1`}
          >
            <h2 className="hidden lg:block font-bold text-slate-900 mb-2 uppercase tracking-wider text-xs">
              სამედიცინო მიმართულებები
            </h2>
            <div className="space-y-1.5 text-sm">
              {[
                { id: "all", label: "ყველა მიმართულება" },
                { id: "cardiology", label: "კარდიოლოგია" },
                { id: "pediatrics", label: "პედიატრია" },
                { id: "neurology", label: "ნევროლოგია" },
                { id: "endocrinology", label: "ენდოკრინოლოგია" },
                { id: "traumatology", label: "ტრავმატოლოგია" },
                { id: "dermatology", label: "დერმატოლოგია" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedSpecialty(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    selectedSpecialty === cat.id
                      ? "bg-sky-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedSpecialty("all");
              }}
              className="w-full mt-4 py-2 text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              ფილტრების გასუფთავება
            </button>
          </div>
        </aside>

        {/* ექიმების სია */}
        <section className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-900">
              ხელმისაწვდომი სპეციალისტები ({filteredDoctors.length})
            </h2>
          </div>

          {loading ? (
            <p className="text-slate-500 text-sm py-4">იტვირთება...</p>
          ) : filteredDoctors.length === 0 ? (
            <p className="text-slate-500 py-8 text-center bg-white rounded-xl border border-dashed border-slate-200">
              სპეციალისტი ვერ მოიძებნა.
            </p>
          ) : (
            filteredDoctors.map((doc) => (
              <CardTemp key={doc.id}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-3xl border border-slate-200 shrink-0">
                      {doc.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {doc.name}
                      </h3>
                      <p className="text-xs text-sky-700 font-medium">
                        {doc.spec} • {doc.experience}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[11px] text-slate-500 mr-1">
                          თავისუფალი საათები:
                        </span>
                        {doc.availableSlots?.map((slot) => (
                          <span
                            key={slot}
                            className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 gap-2 shrink-0">
                    <span className="text-base font-black text-slate-900">
                      {doc.price}
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openBookingModal(doc)}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5"
                      >
                        📅 დროის არჩევა და ჯავშანი
                      </button>

                      {currentRole === "admin" && (
                        <button
                          type="button"
                          onClick={() => deleteDoctor(doc.id)}
                          className="px-2.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold rounded-lg transition"
                          title="წაშლა"
                        >
                          წაშლა
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </CardTemp>
            ))
          )}
        </section>
      </div>

      {/* 📅 ინტერაქციული ჯავშნისა და კალენდრის მოდალი */}
      {bookingDoctor && (
        <Modal
          isOpen={Boolean(bookingDoctor)}
          onClose={() => setBookingDoctor(null)}
          title={`ვიზიტის დაჯავშნა: ${bookingDoctor.name}`}
        >
          <form onSubmit={confirmBooking} className="space-y-4">
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900">
              სპეციალობა: <strong>{bookingDoctor.spec}</strong> | ვიზიტის
              ღირებულება: <strong>{bookingDoctor.price}</strong>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                აირჩიეთ ვიზიტის თარიღი:
              </label>
              <input
                type="date"
                defaultValue="2026-10-28"
                min="2026-10-28"
                max="2026-11-15"
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                აირჩიეთ თავისუფალი დრო (სლოტი):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {bookingDoctor.availableSlots?.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      selectedSlot === slot
                        ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                        : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    ⏰ {slot}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                პაციენტის სახელი და გვარი:
              </label>
              <input
                type="text"
                readOnly
                value={currentUser?.name || "გიორგი ნადარეიშვილი"}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-600 font-semibold"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBookingDoctor(null)}
                className="flex-1 py-2.5 border border-slate-300 text-slate-600 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                გაუქმება
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md transition"
              >
                დაჯავშნის დადასტურება
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* ახალი ექიმის დამატების მოდალი ადმინისთვის */}
      <Modal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        title="ახალი ექიმის დამატება"
      >
        <DoctorForm
          onAddDoctor={addDoctor}
          onClose={() => setIsDoctorModalOpen(false)}
        />
      </Modal>
    </main>
  );
}
