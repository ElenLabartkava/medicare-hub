import { useState, useEffect } from "react";
import { fetchDoctors } from "../services/api";

export function useDoctors() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors().then((docs) => {
      setData(docs);
      setLoading(false);
    });
  }, []);

  return { doctors: data, loading };
}