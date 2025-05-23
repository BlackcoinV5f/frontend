// components/DateInput.jsx
import React, { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import fr from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";

// Enregistre la langue française
registerLocale("fr", fr);

export default function DateInput({ onChange }) {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleChange = (date) => {
    setSelectedDate(date);
    if (onChange) {
      const formatted = date instanceof Date
        ? date.toISOString().split("T")[0] // Format yyyy-mm-dd
        : "";
      onChange(formatted);
    }
  };

  return (
    <div className="w-full">
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        locale="fr"
        dateFormat="dd/MM/yyyy"
        placeholderText="jj/mm/aaaa"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
