import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";

export default function useTelegram() {
  const [user, setUser] = useState(null);
  const { fetchBalance, updateUser, fetchTelegramData } = useUser();

  useEffect(() => {
    const initDataRaw = window.Telegram?.WebApp?.initData;

    if (initDataRaw) {
      fetchTelegramData({ initData: initDataRaw })
        .then((res) => {
          setUser(res);
          localStorage.setItem("telegramUser", JSON.stringify(res));
          updateUser?.(String(res.telegram_id), res);

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
