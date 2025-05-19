import React from "react";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";

const Status = ({ level, progress, bonus }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Statut du compte</h3>
      <p className="text-sm text-gray-600">
        Niveau : <Badge>{level}</Badge>
      </p>
      <Progress value={progress} className="h-2" />
      <p className="text-sm text-gray-500">Bonus de parrainage : {bonus} %</p>
    </div>
  );
};

export default Status;
