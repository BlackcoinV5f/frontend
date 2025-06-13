import React, { useEffect } from "react";
import { useUser } from "../contexts/UserContext";

const Status = () => {
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
      <h2>Status</h2>
      <p>Contenu de la page Status...</p>
    </div>
  );
};

export default Status;
