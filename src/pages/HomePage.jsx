import { useState, useMemo, useCallback } from "react";
import CardTemp from "../components/common/CardTemp";
import Modal from "../components/common/Modal";
import DoctorForm from "../components/DoctorForm";
import { useDoctorStore } from "../store/useDoctorStore";

export default function HomePage({
  currentRole = "patient",
  currentUser = null,
  simulateError = false,
}) {
  const doctors = useDoctorStore((state) => state.doctors);
  const bookings = useDoctorStore((state) => state.bookings);
  const addBooking = useDoctorStore((state) => state.addBooking);
  const cancelBooking = useDoctorStore((state) => state.cancelBooking);
  const addDoctor = useDoctorStore((state) => state.addDoctor);
  const deleteDoctor = useDoctorStore((state) => state.deleteDoctor);

  const isOffline = simulateError;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");

  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2026-10-31");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState(null);
  const [bookingInProgressId, setBookingInProgressId] = useState(null);

  const specialties = [
    { id: "all", name: "ყველა სპეციალობა", icon: "🩺" },
    { id: "cardiology", name: "კარდიოლოგია", icon: "❤️" },
    { id: "pediatrics", name: "პედიატრია", icon: "👶" },
    { id: "neurology", name: "ნევროლოგია", icon: "🧠" },
    { id: "endocrinology", name: "ენდოკრინოლოგია", icon: "🧬" },
    { id: "traumatology", name: "ტრავმატოლოგია", icon: "🦴" },
    { id: "dermatology", name: "დერმატოლოგია", icon: "🔬" },
  ];

  // ექიმების ფილტრაცია
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.spec.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty =
        selectedSpecialty === "all" || doc.category === selectedSpecialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [doctors, searchTerm, selectedSpecialty]);

  // პაციენტის პირადი ჯავშნები (მხოლოდ საკუთარი)
  const myPatientBookings = useMemo(() => {
    if (!currentUser || currentRole !== "patient") return [];
    return bookings.filter((b) => b.patientName === currentUser.name);
  }, [bookings, currentUser, currentRole]);

  // ექიმის სამუშაო განრიგი — მხოლოდ ის ჯავშნები, სადაც ეს კონკრეტული ექიმია მითითებული!
  const myDoctorSchedule = useMemo(() => {
    if (!currentUser || currentRole !== "doctor") return [];
    return bookings.filter((b) => b.doctorName === currentUser.name);
  }, [bookings, currentUser, currentRole]);

  // ამოწმებს, დაკავებულია თუ არა სლოტი
  const isSlotTaken = (slotTime) => {
    if (!bookingDoctor) return false;
    return bookings.some(
      (b) =>
        b.doctorId === bookingDoctor.id &&
        b.date === selectedDate &&
        b.time === slotTime,
    );
  };

  const handleConfirmBooking = useCallback(() => {
    if (!selectedSlot || !bookingDoctor) return;

    setBookingInProgressId(bookingDoctor.id);

    setTimeout(() => {
      addBooking({
        id: Date.now(),
        doctorId: bookingDoctor.id,
        doctorName: bookingDoctor.name,
        doctorSpec: bookingDoctor.spec,
        patientName: currentUser ? currentUser.name : "სტუმარი პაციენტი",
        date: selectedDate,
        time: selectedSlot,
      });

      setBookingSuccessMsg(
        `ვიზიტი წარმატებით დაიჯავშნა: ${bookingDoctor.name} (${selectedDate} ${selectedSlot})`,
      );
      setBookingInProgressId(null);
      setBookingDoctor(null);
      setSelectedSlot("");
    }, 400);
  }, [bookingDoctor, selectedDate, selectedSlot, currentUser, addBooking]);

  const handleOpenBooking = (doc) => {
    setBookingDoctor(doc);
    const firstFreeSlot = doc.availableSlots?.find(
      (slot) =>
        !bookings.some(
          (b) =>
            b.doctorId === doc.id && b.date === selectedDate && b.time === slot,
        ),
    );
    setSelectedSlot(firstFreeSlot || "");
    setBookingSuccessMsg(null);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* წარმატებული ჯავშნის შეტყობინება */}
      {bookingSuccessMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span className="text-sm font-semibold">{bookingSuccessMsg}</span>
          </div>
          <button
            onClick={() => setBookingSuccessMsg(null)}
            className="text-emerald-600 hover:text-emerald-900 font-bold text-sm"
          >
            ✕
          </button>
        </div>
      )}

      {/* Offline შეტყობინება */}
      {isOffline && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between text-amber-900 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📡</span>
            <div>
              <h4 className="font-bold text-sm">
                სერვერთან კავშირი გათიშულია (სიმულაცია: API 500)
              </h4>
              <p className="text-xs text-amber-700">
                ჩართულია Offline Fallback რეჟიმი — გამოიყენება ლოკალური
                მონაცემები.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold bg-amber-200 text-amber-900 px-3 py-1 rounded-full shrink-0">
            Offline Mode
          </span>
        </div>
      )}

      {/* 1. პაციენტის პირადი ჯავშნები */}
      {currentRole === "patient" && myPatientBookings.length > 0 && (
        <section className="mb-10 bg-sky-50/70 border border-sky-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>📋</span> ჩემი დაჯავშნილი ვიზიტები (
              {myPatientBookings.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myPatientBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white p-4 rounded-xl border border-sky-100 shadow-sm text-sm flex flex-col justify-between"
              >
                <div>
                  <div className="font-bold text-slate-900">{b.doctorName}</div>
                  <div className="text-xs text-sky-600 font-medium">
                    {b.doctorSpec}
                  </div>
                  <div className="mt-2 text-xs text-slate-500 flex justify-between items-center border-t border-slate-100 pt-2">
                    <span>🗓️ {b.date}</span>
                    <span className="font-bold text-slate-700">
                      ⏰ {b.time}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => cancelBooking(b.id)}
                  className="mt-3 w-full py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold transition"
                >
                  ჯავშნის გაუქმება ✕
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. ექიმის სამუშაო განრიგი — მხოლოდ ამ ექიმზე დანიშნული პაციენტები */}
      {currentRole === "doctor" && (
        <section className="mb-10 bg-sky-50/60 border border-sky-200 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>📅</span> ჩემი სამუშაო განრიგი ({currentUser?.name}) —{" "}
            {myDoctorSchedule.length} პაციენტი
          </h2>
          {myDoctorSchedule.length === 0 ? (
            <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-slate-500 text-sm">
              <span className="text-2xl block mb-1">☕</span>
              თქვენს სახელზე ამ ეტაპზე ჩაწერილი პაციენტები არ არიან.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myDoctorSchedule.map((b) => (
                <div
                  key={b.id}
                  className="bg-white p-4 rounded-xl border border-sky-100 shadow-sm text-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-800">
                      პაციენტი: {b.patientName}
                    </div>
                    <div className="text-xs text-sky-600 mt-0.5">
                      სპეციალობა: {b.doctorSpec}
                    </div>
                    <div className="mt-2 text-xs text-slate-500 flex justify-between items-center border-t border-slate-100 pt-2">
                      <span>🗓️ {b.date}</span>
                      <span className="font-bold text-slate-700">
                        ⏰ {b.time}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => cancelBooking(b.id)}
                    className="mt-3 w-full py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold transition"
                  >
                    ვიზიტის გაუქმება ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ძიება და ფილტრი */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="მოძებნეთ ექიმი ან სპეციალობა..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {specialties.map((s) => (
              <option key={s.id} value={s.id}>
                {s.icon} {s.name}
              </option>
            ))}
          </select>

          {currentRole === "admin" && (
            <button
              onClick={() => setIsDoctorModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-sm transition flex items-center gap-2 shrink-0"
            >
              <span>➕</span> ახალი ექიმი
            </button>
          )}
        </div>
      </div>

      {/* ექიმების სია */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            ექიმების სია ({filteredDoctors.length})
          </h2>
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <span className="text-3xl block mb-2">🔍</span>
            <p className="text-slate-600 font-semibold text-sm">
              ექიმი მითითებული პარამეტრებით ვერ მოიძებნა
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => (
              <div key={doc.id} className="relative">
                <CardTemp className="flex-col! items-stretch">
                  <div className="flex items-start justify-between w-full gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-2xl shrink-0">
                        {doc.avatar || "👨‍⚕️"}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 leading-snug">
                          {doc.name}
                        </h3>
                        <p className="text-xs font-semibold text-sky-600">
                          {doc.spec}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {doc.experience}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                        {doc.price}
                      </span>
                      {currentRole === "admin" && (
                        <button
                          type="button"
                          onClick={() => deleteDoctor(doc.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="ექიმის წაშლა"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="w-full mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>ხელმისაწვდომია</span>
                    </div>

                    {/* „დაჯავშნა“ ღილაკი ჩნდება მხოლოდ მაშინ, როცა მომხმარებელი არის პაციენტი! */}
                    {currentRole === "patient" ? (
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(doc)}
                        disabled={bookingInProgressId === doc.id}
                        className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow-sm"
                      >
                        {bookingInProgressId === doc.id
                          ? "მუშავდება..."
                          : "დაჯავშნა"}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        (მხოლოდ პაციენტებისთვის)
                      </span>
                    )}
                  </div>
                </CardTemp>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ჯავშნის მოდალი */}
      {bookingDoctor && (
        <Modal
          isOpen={!!bookingDoctor}
          onClose={() => setBookingDoctor(null)}
          title={`ვიზიტის დაჯავშნა: ${bookingDoctor.name}`}
        >
          <div className="space-y-5 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                აირჩიეთ თარიღი:
              </label>
              <input
                type="date"
                value={selectedDate}
                min="2026-10-27"
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                თავისუფალი დროის სლოტები:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {bookingDoctor.availableSlots &&
                bookingDoctor.availableSlots.length > 0 ? (
                  bookingDoctor.availableSlots.map((slot) => {
                    const isTaken = isSlotTaken(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isTaken}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 text-xs font-bold rounded-lg border transition ${
                          isTaken
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through opacity-60"
                            : selectedSlot === slot
                              ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                              : "border-slate-200 hover:border-sky-300 bg-slate-50 text-slate-700"
                        }`}
                      >
                        {slot} {isTaken ? " (დაკავებული)" : ""}
                      </button>
                    );
                  })
                ) : (
                  <span className="col-span-3 text-xs text-slate-400">
                    სლოტები არ არის
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={
                  !selectedSlot || bookingInProgressId === bookingDoctor.id
                }
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-xl font-bold transition shadow-sm"
              >
                {bookingInProgressId === bookingDoctor.id
                  ? "მუშავდება..."
                  : "ჯავშნის დადასტურება"}
              </button>
              <button
                type="button"
                onClick={() => setBookingDoctor(null)}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold transition"
              >
                გაუქმება
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ახალი ექიმის რეგისტრაციის მოდალი */}
      {isDoctorModalOpen && (
        <Modal
          isOpen={isDoctorModalOpen}
          onClose={() => setIsDoctorModalOpen(false)}
          title="ახალი ექიმის რეგისტრაცია"
        >
          <DoctorForm
            onAddDoctor={(newDoc) => {
              addDoctor(newDoc);
              setIsDoctorModalOpen(false);
            }}
            onCancel={() => setIsDoctorModalOpen(false)}
          />
        </Modal>
      )}
    </main>
  );
}
