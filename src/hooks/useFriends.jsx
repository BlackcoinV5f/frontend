import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useFriends = () => {
  const { user, axiosInstance } = useUser();
  const queryClient = useQueryClient();

  // ================= QUERY =================
  const query = useQuery({
    queryKey: ["friends", user?.id],
    queryFn: async () => {
      const res = await axiosInstance.get("/friends/me/");
      return res.data;
    },
    enabled: !!user,

    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,

    retry: false,
  });

  // ================= MUTATION =================
  const generateCode = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post("/friends/generate-code/");
      return res.data;
    },

    onSuccess: (newData) => {
      queryClient.setQueryData(["friends", user?.id], (oldData) => ({
        ...oldData,
        promo_code: newData.promo_code,
      }));
    },
  });

  return {
    ...query,
    generateCode,
  };
};