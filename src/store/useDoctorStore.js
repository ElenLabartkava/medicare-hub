import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const initialDoctors = [
  {
    id: 1,
    name: "დოქტ. გიორგი ასათიანი",
    spec: "კარდიოლოგი",
    category: "cardiology",
    experience: "12 წლიანი გამოცდილება",
    price: "90 GEL",
    avatar: "👨‍⚕️",
    availableSlots: ["10:00", "11:30", "15:00"],
  },
  {
    id: 2,
    name: "დოქტ. ნინო კაპანაძე",
    spec: "პედიატრი",
    category: "pediatrics",
    experience: "8 წლიანი გამოცდილება",
    price: "75 GEL",
    avatar: "👩‍⚕️",
    availableSlots: ["09:30", "12:00", "14:00"],
  },
  {
    id: 3,
    name: "დოქტ. ლევან მესხი",
    spec: "ნევროლოგი",
    category: "neurology",
    experience: "15 წლიანი გამოცდილება",
    price: "110 GEL",
    avatar: "👨‍⚕️",
    availableSlots: ["11:00", "13:30", "16:00"],
  },
  {
    id: 4,
    name: "დოქტ. მარიამ ჩხეიძე",
    spec: "ენდოკრინოლოგი",
    category: "endocrinology",
    experience: "10 წლიანი გამოცდილება",
    price: "85 GEL",
    avatar: "👩‍⚕️",
    availableSlots: ["10:30", "14:30"],
  },
  {
    id: 5,
    name: "დოქტ. ოთარ კვარაცხელია",
    spec: "ტრავმატოლოგი",
    category: "traumatology",
    experience: "14 წლიანი გამოცდილება",
    price: "100 GEL",
    avatar: "👨‍⚕️",
    availableSlots: ["12:30", "16:30"],
  },
  {
    id: 6,
    name: "დოქტ. თამარ ერისთავი",
    spec: "დერმატოლოგი",
    category: "dermatology",
    experience: "7 წლიანი გამოცდილება",
    price: "80 GEL",
    avatar: "👩‍⚕️",
    availableSlots: ["11:00", "15:30"],
  },
];

export const useDoctorStore = create(
  persist(
    (set) => ({
      doctors: initialDoctors,
      bookings: [],

      // ახალი ექიმის დამატება
      addDoctor: (newDoctor) =>
        set((state) => ({
          doctors: [
            {
              id: Date.now(),
              availableSlots: ["10:00", "12:00", "15:00"],
              avatar: "👨‍⚕️",
              ...newDoctor,
            },
            ...state.doctors,
          ],
        })),

      // ექიმის წაშლა
      deleteDoctor: (id) =>
        set((state) => ({
          doctors: state.doctors.filter((doc) => doc.id !== id),
        })),

      // ვიზიტის დაჯავშნა
      addBooking: (booking) =>
        set((state) => ({
          bookings: [
            {
              id: Date.now(),
              status: "დადასტურებული",
              ...booking,
            },
            ...state.bookings,
          ],
        })),
    }),
    {
      name: "medicare-hub-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);