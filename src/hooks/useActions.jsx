import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useActions = (category) => {
  const { user, axiosInstance } = useUser();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["actions", category, user?.id],

    queryFn: async () => {
      if (!user?.id || !category) return [];

      const res = await axiosInstance.get(`/actions/category/${category}`);
      return res.data || [];
    },

    enabled: !!user?.id && !!category,

    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });

  const refresh = () => {
    queryClient.invalidateQueries(["actions", category, user?.id]);
  };

  return {
    ...query,
    refresh,
  };
};