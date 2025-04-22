import React from "react";
import { Card, CardContent } from "./ui/card"; // ✅ Bon chemin

const UserInfoCard = ({ user }) => {
  return (
    <Card className="rounded-2xl shadow-md p-4">
      <CardContent className="flex items-center space-x-4">
        {user.photo_url ? (
          <img
            src={user.photo_url}
            alt={user.username}
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl">
            {user.first_name?.charAt(0) || "U"}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-sm text-gray-600">@{user.username}</p>
          <p className="text-sm text-gray-500">ID : {user.id}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
