import React from "react";
import { Button } from "./ui/button"; // Corrigé pour le bon chemin relatif
import { PlusCircle, Users, ClipboardList } from "lucide-react";

const MyActions = ({ onTask, onInvite, onCheckStatus }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-2">Mes Actions</h3>
      <div className="grid grid-cols-3 gap-2">
        <Button onClick={onTask} className="flex flex-col items-center">
          <ClipboardList size={20} />
          <span className="text-xs">Tâches</span>
        </Button>
        <Button onClick={onInvite} className="flex flex-col items-center">
          <Users size={20} />
          <span className="text-xs">Inviter</span>
        </Button>
        <Button onClick={onCheckStatus} className="flex flex-col items-center">
          <PlusCircle size={20} />
          <span className="text-xs">Statut</span>
        </Button>
      </div>
    </div>
  );
};

export default MyActions;
