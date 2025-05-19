import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { parseTelegramData } from "../utils/telegramAuth";

export default function Auth() {
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const userData = parseTelegramData(searchParams);
        
        if (userData.id) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/telegram`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            })
            .then((res) => res.json())
            .then((data) => {
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.href = "/dashboard";
            })
            .catch((err) => console.error("Erreur auth Telegram :", err));
        }
    }, [searchParams]);

    return <h1>Connexion en cours...</h1>;
}
