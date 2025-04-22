// src/components/Dashboard/ui/input.jsx
import React from "react";

export const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`border border-gray-300 rounded-lg px-3 py-2 text-sm w-full ${className}`}
      {...props}
    />
  );
};
