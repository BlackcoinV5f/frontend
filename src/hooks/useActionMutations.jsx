import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useActionMutations = () => {
  const { axiosInstance, user } = useUser();
  const queryClient = useQueryClient();

  const buy = useMutation({
    mutationFn: (id) => axiosInstance.post(`/actions/buy/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries(["actions"]);
    },
  });

  const start = useMutation({
    mutationFn: (id) => axiosInstance.post(`/actions/start/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries(["actions"]);
    },
  });

  const claim = useMutation({
    mutationFn: (id) => axiosInstance.post(`/actions/claim/${id}`),

    onSuccess: () => {
      queryClient.invalidateQueries(["actions"]);
    },
  });

  return { buy, start, claim };
};