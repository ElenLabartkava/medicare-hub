import { useState, useEffect } from "react";
import { fetchDoctors } from "../services/api";

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors().then((docs) => {
      setDoctors(docs);
      setLoading(false);
    });
  }, []);

  const addDoctor = (newDoc) => {
    setDoctors((prev) => [newDoc, ...prev]);
  };

  const deleteDoctor = (id) => {
    setDoctors((prev) => prev.filter((doc) => doc.id !== id));
  };

  return { doctors, loading, addDoctor, deleteDoctor };
}