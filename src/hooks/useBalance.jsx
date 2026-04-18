import { useQuery } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useBalance = () => {
  const { user, axiosInstance } = useUser();

  return useQuery({
    queryKey: ["balance", user?.id],

    queryFn: async () => {
      const res = await axiosInstance.get("/balance/");

      // ✅ sécurise le format (backend incohérent possible)
      return res.data.balance ?? res.data.points ?? 0;
    },

    enabled: !!user?.id,

    // ✅ IMPORTANT pour jeu temps réel
    staleTime: 0,

    // ❌ inutile ici (on contrôle manuellement)
    refetchOnWindowFocus: false,

    // ✅ évite crash UI
    initialData: 0,
  });
};