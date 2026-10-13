import { useState, useEffect, useCallback } from "react";
import { fetchDoctors } from "../services/api";

export function useDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [simulateError, setSimulateError] = useState(false);

  const loadData = useCallback(() => {
    setLoading(true);
    fetchDoctors(simulateError).then((res) => {
      setDoctors(res.data);
      setIsOffline(res.isOfflineFallback);
      setLoading(false);
    });
  }, [simulateError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleSimulateError = () => {
    setSimulateError((prev) => !prev);
  };

  const addDoctor = (newDoc) => {
    setDoctors((prev) => [newDoc, ...prev]);
  };

  const deleteDoctor = (id) => {
    setDoctors((prev) => prev.filter((doc) => doc.id !== id));
  };

  return {
    doctors,
    loading,
    isOffline,
    simulateError,
    toggleSimulateError,
    reload: loadData,
    addDoctor,
    deleteDoctor,
  };
}