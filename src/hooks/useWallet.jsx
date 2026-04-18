import { useQuery } from "@tanstack/react-query";
import { useUser } from "../context/UserContext";

export const useWallet = () => {
  const { axiosInstance, user } = useUser();

  return useQuery({
    queryKey: ["wallet", user?.id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/wallet/${user.id}`);
      return data?.balance || 0;
    },
    enabled: !!user?.id,
  });
};