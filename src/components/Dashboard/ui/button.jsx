// src/components/Dashboard/ui/button.jsx
import React from "react";

export const Button = ({ children, onClick, className, type = "button", ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
