import { useQuery } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useBalance = () => {
  const { user, axiosInstance } = useUser();

  return useQuery({
    queryKey: ["balance", user?.id],

    queryFn: async () => {
      const res = await axiosInstance.get("/balance/");

      // 🔥 normalisation robuste
      return (
        res.data?.balance ??
        res.data?.points ??
        0
      );
    },

    enabled: !!user?.id,

    // 🔥 cache intelligent
    staleTime: 1000 * 30,      // 30s = pas de spam
    cacheTime: 1000 * 60 * 5,  // 5min mémoire

    // 🔥 éviter refetch inutiles
    refetchOnWindowFocus: false,
    refetchOnMount: false,

    // 🔥 retry safe
    retry: 1,

    // 🔥 UX propre
    placeholderData: (prev) => prev ?? undefined,
  });
};