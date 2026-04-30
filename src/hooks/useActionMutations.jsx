import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useActionMutations = () => {
  const { axiosInstance, user } = useUser();
  const queryClient = useQueryClient();

  // -----------------------
  // BUY PACK (catalogue)
  // -----------------------
  const buy = useMutation({
    mutationFn: (id) => axiosInstance.post(`/actions/buy/${id}`),

    onSuccess: () => {
      // refresh catalogue
      queryClient.invalidateQueries({ queryKey: ["actions"] });

      // refresh portfolio
      queryClient.invalidateQueries({ queryKey: ["myAssets"] });
    },
  });

  // -----------------------
  // START PACK (user)
  // -----------------------
  const start = useMutation({
    mutationFn: (id) => axiosInstance.post(`/my-assets/start/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAssets"] });
    },
  });

  // -----------------------
  // CLAIM REWARD (user)
  // -----------------------
  const claim = useMutation({
    mutationFn: (id) => axiosInstance.post(`/my-assets/claim/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAssets"] });
    },
  });

  return { buy, start, claim };
};