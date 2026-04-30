import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAdm } from "../contexts/AdmContext";
import { useUser } from "../contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import "./Depots.css";

export default function Depots() {
  // ✅ namespace correct
  const { t } = useTranslation("transactions");

  const { id } = useParams();
  const { axiosDeposit } = useAdm();
  const { user } = useUser();
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const currencies = ["FCFA", "USDT", "PI", "EURO", "USD"];

  const [form, setForm] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
    amount: "",
    transaction_id: "",
    currency: "FCFA",
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const { data: method, isLoading, isError } = useQuery({
    queryKey: ["depositMethod", id],
    queryFn: async () => {
      const res = await axiosDeposit.get(`/transaction-methods/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCurrencyOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.username || !form.phone || !form.amount || !form.transaction_id) {
      setMessage(`❌ ${t("deposit.form.errors.required")}`);
      return;
    }

    const amountNumber = parseFloat(form.amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      setMessage(`❌ ${t("deposit.form.errors.invalidAmount")}`);
      return;
    }

    if (!user?.id) {
      setMessage(`❌ ${t("deposit.form.errors.noUser")}`);
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const payload = {
        user_id: user.id,
        username: form.username,
        phone: form.phone,
        amount: amountNumber,
        currency: form.currency,
        transaction_id: form.transaction_id,
        method_id: method.id,
        country: method.country,
      };

      await axiosDeposit.post("/deposits/", payload);

      setMessage(`✅ ${t("deposit.form.success")}`);
      setForm({ ...form, amount: "", transaction_id: "" });
    } catch {
      setMessage(`❌ ${t("deposit.form.errors.generic")}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <p>{t("deposit.loading", "Chargement...")}</p>;
  if (isError) return <p>❌ {t("deposit.error")}</p>;
  if (!method) return <p>{t("deposit.notFound")}</p>;

  return (
    <motion.div className="deposit-container">
      <div className="deposit-header">
        <img src={method.icon_url} alt={method.name} className="deposit-method-icon" />
        <h2>{method.name}</h2>
      </div>

      {method.country && <p>{t("deposit.country")} : {method.country}</p>}

      <p className="deposit-account">
        📱 {t("deposit.account")} :{" "}
        <strong>{method.account_number || "+2250123456789"}</strong>
      </p>

      <div className="deposit-form">
        <input
          name="username"
          placeholder={t("deposit.form.username")}
          value={form.username}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder={t("deposit.form.phone")}
          value={form.phone}
          onChange={handleChange}
        />

        <div className="amount-container">
          <input
            name="amount"
            type="number"
            placeholder={t("deposit.form.amount")}
            value={form.amount}
            onChange={handleChange}
          />

          <div
            className="currency-dropdown"
            ref={dropdownRef}
            onClick={() => setCurrencyOpen(!currencyOpen)}
          >
            <div className="currency-selected">{form.currency}</div>

            {currencyOpen && (
              <div className="currency-list">
                {currencies.map((cur) => (
                  <div
                    key={cur}
                    className="currency-item"
                    onClick={() => {
                      setForm({ ...form, currency: cur });
                      setCurrencyOpen(false);
                    }}
                  >
                    {cur}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <input
          name="transaction_id"
          placeholder={t("deposit.form.transactionId")}
          value={form.transaction_id}
          onChange={handleChange}
        />

        <motion.button
          className="deposit-button"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting
            ? t("deposit.form.sending")
            : t("deposit.form.submit")}
        </motion.button>
      </div>

      {message && <p className="deposit-message">{message}</p>}

      <motion.button
        className="back-button"
        onClick={() => navigate("/deposit-methods")}
      >
        ⬅ {t("deposit.backMethods")}
      </motion.button>
    </motion.div>
  );
}