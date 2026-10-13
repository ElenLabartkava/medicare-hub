import { doctors } from "../data/doctors";

export const fetchDoctors = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(doctors);
    }, 200);
  });
};