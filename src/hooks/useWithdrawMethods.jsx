import { useQuery } from "@tanstack/react-query";
import { useAdm } from "../contexts/AdmContext";

export const useWithdrawMethods = () => {
  const { axiosDeposit } = useAdm();

  return useQuery({
    queryKey: ["withdrawMethods", "adm"], // ✅ aligné avec deposit

    queryFn: async () => {
      const res = await axiosDeposit.get("/withdraw-methods");
      return res.data || [];
    },

    enabled: !!axiosDeposit,

    staleTime: Infinity,
    gcTime: Infinity, // ✅ fix v5

    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};