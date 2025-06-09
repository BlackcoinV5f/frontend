import { useEffect, useState } from "react";

export default function useTelegram() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    const telegramUser = tg?.initDataUnsafe?.user;

    if (telegramUser) {
      const { id, first_name, last_name, username, photo_url } = telegramUser;
      const userData = { id, first_name, last_name, username, photo_url };

      setUser(userData);
      localStorage.setItem("telegramUser", JSON.stringify(userData));
    }
  }, []);

  return user;
}
