import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function useTelegram() {
  const [user, setUser] = useState(null);
  const { fetchBalance, updateUser } = useUser();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const telegramUser = tg?.initDataUnsafe?.user;

    const saveAndAuthUser = async (userData) => {
      try {
        setUser(userData);
        localStorage.setItem("telegramUser", JSON.stringify(userData));
        updateUser?.(userData.telegram_id, userData);

        // 🔁 Appel backend pour créer/synchroniser l'utilisateur + bonus
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/telegram`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        if (!response.ok) throw new Error("Erreur lors de l'authentification via backend");

        const result = await response.json();
        console.log("Utilisateur authentifié ou créé avec succès :", result);

        // ✅ BONUS canal : rediriger vers le canal s’il est nouveau
        const isNew = !localStorage.getItem("joinedTelegramChannel");
        if (isNew) {
          localStorage.setItem("joinedTelegramChannel", "true");
          window.open("https://t.me/blackcoin202", "_blank"); // ✅ Ouvre le canal Telegram
        }

      } catch (err) {
        console.error("Erreur lors de l'envoi vers /auth/telegram :", err);
      }
    };

    if (telegramUser) {
      const { id, first_name, last_name, username, photo_url } = telegramUser;
      const userData = {
        telegram_id: String(id),
        first_name,
        last_name,
        username,
        photo_url,
      };
      saveAndAuthUser(userData);
    } else {
      const storedUser = localStorage.getItem("telegramUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        updateUser?.(parsed.telegram_id, parsed);
      }
    }
  }, [updateUser]);

  useEffect(() => {
    if (user?.telegram_id) {
      fetchBalance(user.telegram_id)
        .then((balance) => {
          console.log("Solde récupéré via Telegram :", balance);
        })
        .catch((err) => {
          console.error("Erreur fetchBalance (Telegram):", err);
        });
    }
  }, [user, fetchBalance]);

  return user;
}
