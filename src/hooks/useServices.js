import { useState, useEffect } from "react";

const INITIAL_DOCTORS = [
  {
    id: 1,
    name: "დავით ბერიძე",
    spec: "კარდიოლოგი",
    category: "cardiology",
    experience: "12 წლიანი გამოცდილება",
    price: "80 GEL",
    avatar: "👨‍⚕️",
    availableSlots: ["10:00", "12:30", "15:00", "17:30"],
  },
  {
    id: 2,
    name: "ნინო კაკანაძე",
    spec: "პედიატრი",
    category: "pediatrics",
    experience: "8 წლიანი გამოცდილება",
    price: "60 GEL",
    avatar: "👩‍⚕️",
    availableSlots: ["09:30", "11:00", "14:00", "16:30"],
  },
  {
    id: 3,
    name: "გიორგი მახარაძე",
    spec: "ნევროლოგი",
    category: "neurology",
    experience: "15 წლიანი გამოცდილება",
    price: "90 GEL",
    avatar: "👨‍⚕️",
    availableSlots: ["11:30", "13:00", "16:00"],
  },
  {
    id: 4,
    name: "თამარ ერისთავი",
    spec: "ენდოკრინოლოგი",
    category: "endocrinology",
    experience: "10 წლიანი გამოცდილება",
    price: "75 GEL",
    avatar: "👩‍⚕️",
    availableSlots: ["10:30", "12:00", "15:30", "18:00"],
  },
  {
    id: 5,
    name: "ლევან ჩხეიძე",
    spec: "ტრავმატოლოგი",
    category: "traumatology",
    experience: "14 წლიანი გამოცდილება",
    price: "85 GEL",
    avatar: "👨‍⚕️",
    availableSlots: ["09:00", "13:30", "17:00"],
  },
  {
    id: 6,
    name: "მარიამ ჯაფარიძე",
    spec: "დერმატოლოგი",
    category: "dermatology",
    experience: "7 წლიანი გამოცდილება",
    price: "70 GEL",
    avatar: "👩‍⚕️",
    availableSlots: ["11:00", "14:30", "16:00", "19:00"],
  },
];

// საწყისი ჯავშნები ექიმის განრიგისთვის
const INITIAL_BOOKINGS = [
  {
    id: 101,
    doctorId: 1,
    doctorName: "დავით ბერიძე",
    patientName: "ნინო გიორგაძე",
    date: "2026-10-28",
    time: "11:00",
    status: "მოლოდინში",
    type: "პირველადი კონსულტაცია",
  },
  {
    id: 102,
    doctorId: 1,
    doctorName: "დავით ბერიძე",
    patientName: "გიორგი მაისურაძე",
    date: "2026-10-28",
    time: "12:30",
    status: "დადასტურებული",
    type: "ანალიზების შეფასება",
  },
];

export function useDoctors() {
  const [doctors, setDoctors] = useState(() => {
    const saved = localStorage.getItem("medicare_doctors");
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem("medicare_bookings");
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [loading, setLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    localStorage.setItem("medicare_doctors", JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem("medicare_bookings", JSON.stringify(bookings));
  }, [bookings]);

  // ახალი ჯავშნის დამატება რეალურ დროში
  const addBooking = (newBooking) => {
    setBookings((prev) => [
      {
        id: Date.now(),
        status: "დადასტურებული",
        ...newBooking,
      },
      ...prev,
    ]);
  };

  const addDoctor = (docData) => {
    const newDoc = {
      id: Date.now(),
      name: docData.name,
      spec: docData.spec || "ზოგადი თერაპევტი",
      category: docData.category || "therapy",
      experience: `${docData.experience || 3} წლიანი გამოცდილება`,
      price: `${docData.price || 70} GEL`,
      avatar: "👨‍⚕️",
      availableSlots: ["10:00", "12:00", "15:00"],
    };
    setDoctors((prev) => [newDoc, ...prev]);
  };

  const deleteDoctor = (id) => {
    setDoctors((prev) => prev.filter((d) => d.id !== id));
  };

  return {
    doctors,
    bookings,
    addBooking,
    addDoctor,
    deleteDoctor,
    loading,
    isOffline,
  };
}