import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useDailyTasks = (packId) => {
  const { user, axiosInstance } = useUser();
  const queryClient = useQueryClient();

  // =========================
  // 📥 FETCH TASKS
  // =========================
  const query = useQuery({
    queryKey: ["dailyTasks", packId, user?.id],

    queryFn: async () => {
      if (!packId) return [];

      const res = await axiosInstance.get(
        `/actions/packs/${packId}/daily-tasks` // ✅ FIX PRINCIPAL
      );

      return res.data || [];
    },

    enabled: !!user && !!packId,
    staleTime: 1000 * 30, // ⚠️ évite Infinity (meilleur comportement)
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // =========================
  // ▶️ START TASK
  // =========================
  const startTask = useMutation({
    mutationFn: ({ taskId }) =>
      axiosInstance.post(
        `/actions/packs/daily-tasks/${taskId}/start`
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dailyTasks", packId, user?.id],
      });
    },
  });

  // =========================
  // ✅ COMPLETE TASK
  // =========================
  const completeTask = useMutation({
    mutationFn: ({ taskId }) =>
      axiosInstance.post(
        `/actions/packs/daily-tasks/${taskId}/complete`
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dailyTasks", packId, user?.id],
      });
    },
  });

  // =========================
  // 💰 CLAIM REWARD
  // =========================
  const claimReward = useMutation({
    mutationFn: () =>
      axiosInstance.post(`/my-assets/claim/${packId}`),

    onSuccess: () => {
      // 🔄 refresh tasks
      queryClient.invalidateQueries({
        queryKey: ["dailyTasks", packId, user?.id],
      });

      // 🔄 refresh assets
      queryClient.invalidateQueries({
        queryKey: ["myAssets", user?.id],
      });

      // 🔄 refresh balance
      queryClient.invalidateQueries({
        queryKey: ["balance"],
      });
    },
  });

  return {
    ...query,
    startTask,
    completeTask,
    claimReward,
  };
};