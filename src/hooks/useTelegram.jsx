import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

/**
 * Hook pour récupérer les données Telegram (via Telegram WebApp)
 * et déclencher une récupération du solde utilisateur.
 */
export default function useTelegram() {
  const [user, setUser] = useState(null);
  const { fetchBalance, updateUser } = useUser();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const telegramUser = tg?.initDataUnsafe?.user;

    if (telegramUser) {
      const { id, first_name, last_name, username, photo_url } = telegramUser;
      const userData = {
        telegram_id: id,
        first_name,
        last_name,
        telegram_username: username,
        photo_url,
      };

      setUser(userData);
      localStorage.setItem("telegramUser", JSON.stringify(userData));

      // ✅ Correction ici
      updateUser?.(userData.telegram_id, userData);
    } else {
      // Fallback: essayer localStorage
      const storedUser = localStorage.getItem("telegramUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        updateUser?.(parsed.telegram_id, parsed); // ✅ Correction ici aussi
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
