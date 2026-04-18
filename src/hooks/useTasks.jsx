import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useTasks = () => {
  const { user, axiosInstance } = useUser();
  const queryClient = useQueryClient();

  // ================= QUERY =================
  const query = useQuery({
    queryKey: ["tasks", user?.id],

    queryFn: async () => {
      const [tasksRes, completedRes] = await Promise.all([
        axiosInstance.get("/tasks/me/pending"),
        axiosInstance.get("/tasks/me/completed-count"),
      ]);

      return {
        tasks: tasksRes.data,
        completedCount: completedRes.data.completed_tasks || 0,
      };
    },

    enabled: !!user,

    staleTime: Infinity,
    gcTime: Infinity,

    refetchOnWindowFocus: false,
  });

  // ================= START TASK =================
  const startTask = useMutation({
    mutationFn: async (task) => {
      await axiosInstance.post(`/tasks/${task.id}/start`);
      return task;
    },

    onSuccess: (task) => {
      // 🔥 update cache directement
      queryClient.setQueryData(["tasks", user?.id], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          tasks: oldData.tasks.map((t) =>
            t.id === task.id
              ? { ...t, started_at: new Date().toISOString() }
              : t
          ),
        };
      });
    },
  });

  return {
    ...query,
    startTask,
  };
};