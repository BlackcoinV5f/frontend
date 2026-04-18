import { useQuery } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useCheck = () => {
  const { axiosInstance, user } = useUser();

  return useQuery({
    queryKey: ["eligibility", user?.id],

    queryFn: async () => {
      const res = await axiosInstance.get("/eligibility/check/");
      return res.data;
    },

    enabled: !!user && !!axiosInstance,

    staleTime: Infinity,
    gcTime: Infinity,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,

    // 🔥 on garde ton optimisation
    select: (data) => {
      const completed = Object.values(data).filter(Boolean).length;

      return {
        ...data,
        completed,
      };
    },
  });
};