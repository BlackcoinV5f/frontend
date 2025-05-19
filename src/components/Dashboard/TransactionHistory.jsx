import React from "react";
import { Card, CardContent } from "./ui/card";

const TransactionHistory = ({ transactions }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Historique des transactions</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {transactions && transactions.length > 0 ? (
          transactions.map((tx, index) => (
            <Card key={tx.id || index} className="rounded-lg shadow-sm">
              <CardContent className="py-2 px-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">
                    {tx.description || "Aucune description"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(tx.created_at).toLocaleString()}
                  </p>
                </div>
                <div
                  className={`text-sm font-semibold ${
                    tx.type === "credit" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {tx.type === "credit" ? "+" : "-"}
                  {tx.amount}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-gray-500">Aucune transaction disponible.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
