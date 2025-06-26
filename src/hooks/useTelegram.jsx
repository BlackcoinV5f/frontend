import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function useTelegram() {
  const [user, setUser] = useState(null);
  const { fetchBalance, updateUser, fetchTelegramData } = useUser(); // Assure-toi d'ajouter fetchTelegramData ici

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const initData = tg?.initDataUnsafe;

    if (initData?.user) {
      const { id, first_name, last_name, username, photo_url } = initData.user;

      const userData = {
        id,
        first_name,
        last_name,
        username,
        photo_url,
        auth_date: initData.auth_date,
        hash: initData.hash,
      };

      // ✅ Appel backend via UserContext
      fetchTelegramData(userData)
        .then((res) => {
          setUser(res);
          localStorage.setItem("telegramUser", JSON.stringify(res));
          updateUser?.(String(id), res);

          // ✅ BONUS canal : rediriger vers le canal s’il est nouveau
          const isNew = res?.isNew && !localStorage.getItem("joinedTelegramChannel");
          if (isNew) {
            localStorage.setItem("joinedTelegramChannel", "true");
            window.open("https://t.me/blackcoin202", "_blank");
          }
        })
        .catch((err) => {
          console.error("Erreur auth Telegram :", err);
        });
    } else {
      const storedUser = localStorage.getItem("telegramUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        updateUser?.(parsed.telegram_id, parsed);
      }
    }
  }, [updateUser, fetchTelegramData]);

  // 🔄 Balance utilisateur
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
