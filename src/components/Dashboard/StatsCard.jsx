import React from "react";
import { Card, CardContent } from "./ui/card"; // corrigé
import { Coins, Wallet } from "lucide-react";

const StatsCard = ({ points, wallet }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card className="rounded-2xl shadow-sm p-4">
        <CardContent className="flex items-center space-x-3">
          <Coins className="text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Points</p>
            <p className="text-lg font-semibold">{points}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm p-4">
        <CardContent className="flex items-center space-x-3">
          <Wallet className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Wallet</p>
            <p className="text-lg font-semibold">{wallet} coins</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCard;
