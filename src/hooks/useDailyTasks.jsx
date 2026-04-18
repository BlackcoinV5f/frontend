import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useDailyTasks = (packId) => {
  const { user, axiosInstance } = useUser();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["dailyTasks", packId, user?.id],

    queryFn: async () => {
      const res = await axiosInstance.get(
        `/actions/packs/${packId}/daily-tasks`
      );
      return res.data || [];
    },

    enabled: !!user && !!packId,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // 🔥 START
  const startTask = useMutation({
    mutationFn: ({ taskId }) =>
      axiosInstance.post(`/actions/packs/daily-tasks/${taskId}/start`),

    onSuccess: () => {
      queryClient.invalidateQueries(["dailyTasks", packId, user?.id]);
    },
  });

  // 🔥 COMPLETE
  const completeTask = useMutation({
    mutationFn: ({ taskId }) =>
      axiosInstance.post(`/actions/packs/daily-tasks/${taskId}/complete`),

    onSuccess: () => {
      queryClient.invalidateQueries(["dailyTasks", packId, user?.id]);
    },
  });

  // 🔥 CLAIM
  const claimReward = useMutation({
    mutationFn: () =>
      axiosInstance.post(`/actions/claim/${packId}`),

    onSuccess: () => {
      queryClient.invalidateQueries(["dailyTasks", packId, user?.id]);
      queryClient.invalidateQueries(["actions"]);
      queryClient.invalidateQueries(["balance"]);
    },
  });

  return {
    ...query,
    startTask,
    completeTask,
    claimReward,
  };
};