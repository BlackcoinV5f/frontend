import { useEffect } from "react";

const TelegramLogin = () => {
  useEffect(() => {
    window.TelegramLoginWidget = (user) => {
      console.log("Données utilisateur Telegram :", user);
      fetch("https://blackcoin-backend-uv43.onrender.com/auth/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Réponse serveur :", data);
          // Sauvegarder les infos dans le localStorage ou contexte global
        })
        .catch((err) => console.error("Erreur :", err));
    };
  }, []);

  return (
    <div>
      <h2>Connecte-toi avec Telegram</h2>
      <script
        async
        src="https://telegram.org/js/telegram-widget.js?22"
        data-telegram-login="TON_BOT_USERNAME"
        data-size="large"
        data-auth-url="https://blackcoin-backend-uv43.onrender.com/auth/telegram"
        data-request-access="write"
      ></script>
    </div>
  );
};

export default TelegramLogin;
