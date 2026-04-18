import { useQuery } from "@tanstack/react-query";
import { useAdm } from "../contexts/AdmContext";

export const useDepositMethods = () => {
  const { axiosDeposit } = useAdm();

  return useQuery({
    queryKey: ["depositMethods", "adm"], // ✅ plus robuste

    queryFn: async () => {
      const res = await axiosDeposit.get("/transaction-methods/");
      return res.data || [];
    },

    enabled: !!axiosDeposit,

    staleTime: Infinity,
    gcTime: Infinity,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
};