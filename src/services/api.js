import { doctors } from "../data/doctors";

// ლოკალური ქეში ოფლაინ რეჟიმისთვის
const LOCAL_CACHE_KEY = "medicare_doctors_cache";

export const fetchDoctors = async (forceServerError = false) => {
  console.time("⏱️ Doctor Data Fetch Time");

  return new Promise((resolve) => {
    setTimeout(() => {
      console.timeEnd("⏱️ Doctor Data Fetch Time");

      // თუ სიმულირებულია სერვერის გათიშვა (500 Error / Offline)
      if (forceServerError) {
        console.warn("⚠️ API Failure (500 Error) simulated. Falling back to local cache/mock.");
        const cached = localStorage.getItem(LOCAL_CACHE_KEY);
        const fallbackData = cached ? JSON.parse(cached) : doctors;
        
        console.table(fallbackData);
        resolve({
          data: fallbackData,
          isOfflineFallback: true,
          error: "სერვერთან კავშირი გაწყდა. ჩაიტვირთა ლოკალური დემო მონაცემები.",
        });
        return;
      }

      // ნორმალური რეჟიმი
      localStorage.setItem(LOCAL_CACHE_KEY, JSON.stringify(doctors));
      console.log("✅ API Success: Data retrieved successfully.");
      console.table(doctors); // Console.table მოწინავე დიაგნოსტიკისთვის

      resolve({
        data: doctors,
        isOfflineFallback: false,
        error: null,
      });
    }, 450);
  });
};