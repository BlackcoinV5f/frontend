import { useQuery } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useRewardPoints = () => {
  const { user, axiosInstance } = useUser();

  return useQuery({
    queryKey: ["rewardPoints", user?.id], // ✅ FIX IMPORTANT

    queryFn: async () => {
      const res = await axiosInstance.get("/wallet/");
      return res.data;
    },

    enabled: !!user,

    staleTime: 1000 * 60 * 15,
    gcTime: 1000 * 60 * 30,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};