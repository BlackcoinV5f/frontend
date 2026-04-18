import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useActions = (activeTab) => {
  const { user, axiosInstance } = useUser();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["actions", activeTab, user?.id],

    queryFn: async () => {
      if (!user?.id) return [];

      if (activeTab === "myactif") {
        const res = await axiosInstance.get("/actions/my-packs");
        return res.data || [];
      }

      const res = await axiosInstance.get(`/actions/category/${activeTab}`);
      return res.data || [];
    },

    enabled: !!user?.id,

    keepPreviousData: true,

    staleTime: 1000 * 60 * 5, // 🔥 important
  });

  // ✅ remplace refetch proprement
  const refresh = () => {
    queryClient.invalidateQueries(["actions", activeTab, user?.id]);
  };

  return {
    ...query,
    refresh,
  };
};