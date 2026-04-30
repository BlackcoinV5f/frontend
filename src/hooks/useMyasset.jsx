import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useMyAssets = () => {
  const { user, axiosInstance } = useUser();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["myAssets", user?.id],

    queryFn: async () => {
      if (!user?.id) return [];

      // ✅ CORRECTION ICI
      const res = await axiosInstance.get("/my-assets/");
      return res.data || [];
    },

    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2,
  });

  const refresh = () => {
    queryClient.invalidateQueries(["myAssets", user?.id]);
  };

  return {
    ...query,
    refresh,
  };
};