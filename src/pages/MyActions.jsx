import React, { useEffect } from "react";
import { useUser } from "../contexts/UserContext";

const MyActions = () => {
  const { user, fetchBalance } = useUser();

  useEffect(() => {
    if (user?.telegram_id) {
      fetchBalance(user.telegram_id)
        .then(() => console.log("Solde mis à jour."))
        .catch((err) => console.error("Erreur de récupération du solde :", err));
    }
  }, [user, fetchBalance]);

  return (
    <div>
      <h2>📌 Mes Actions</h2>
      <p>Contenu de la page My Actions...</p>
    </div>
  );
};

export default MyActions;
