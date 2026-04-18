import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useBonus = () => {
  const { user, axiosInstance } = useUser();
  const queryClient = useQueryClient();

  // ================= QUERY =================
  const query = useQuery({
    queryKey: ["bonus", user?.id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/bonus/${user.id}/status`);
      return res.data;
    },
    enabled: !!user?.id,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  // ================= MUTATION =================
  const claimBonus = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post(`/bonus/${user.id}/claim`);
      return res.data;
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["bonus", user?.id], data);
    },
  });

  return {
    ...query,
    claimBonus,
  };
};