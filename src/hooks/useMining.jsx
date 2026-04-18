import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useMining = () => {
  const { user, axiosInstance } = useUser();
  const queryClient = useQueryClient();

  // ================= QUERY =================
  const query = useQuery({
    queryKey: ["mining", user?.id], // ✅ FIX IMPORTANT

    queryFn: async () => {
      const res = await axiosInstance.get(`/mining/status/${user.id}`);
      return res.data;
    },

    enabled: !!user?.id,

    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // ================= START =================
  const startMining = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/mining/start/${user.id}`);
      return res.data;
    },

    onSuccess: (newData) => {
      queryClient.setQueryData(["mining", user?.id], newData);
    },
  });

  // ================= CLAIM =================
  const claimMining = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/mining/claim/${user.id}`);
      return res.data;
    },

    onSuccess: (newData) => {
      queryClient.setQueryData(["mining", user?.id], newData);

      // 🔥 BONUS: sync balance automatiquement
      queryClient.invalidateQueries(["balance", user?.id]);
    },
  });

  return {
    ...query,
    startMining,
    claimMining,
  };
};