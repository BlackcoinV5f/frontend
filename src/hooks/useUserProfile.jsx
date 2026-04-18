import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../contexts/UserContext";

export const useUserProfile = () => {
  const { setUser } = useUser();
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/update-profile`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Erreur update profil");

      return res.json();
    },

    onSuccess: (updatedUser) => {
      // ✅ update context
      setUser(updatedUser);

      // 🔥 sync global cache
      queryClient.invalidateQueries(["user"]);
    },
  });

  return {
    updateProfile,
  };
};