import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdm } from "../contexts/AdmContext";
import { useUser } from "../contexts/UserContext";
import { useTranslation } from "react-i18next";
import "./Retraits.css";

const Retraits = () => {
  // ✅ namespace correct
  const { t } = useTranslation("transactions");

  const { axiosDeposit } = useAdm();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const method = location.state?.selectedMethod;

  const [form, setForm] = useState({
    address: "",
    amount: "",
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const MIN_AMOUNT = 1.2;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.address || !form.amount) {
      setMessage(`❌ ${t("withdraw.form.errors.required")}`);
      return;
    }

    const amountNumber = parseFloat(form.amount);
    if (isNaN(amountNumber) || amountNumber < MIN_AMOUNT) {
      setMessage(
        `❌ ${t("withdraw.form.errors.minAmount", { min: MIN_AMOUNT })}`
      );
      return;
    }

    if (!user?.id) {
      setMessage(`❌ ${t("withdraw.form.errors.noUser")}`);
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const payload = {
        user_id: user.id,
        username: user.username,
        method_id: method.id,
        method_name: method.name,
        address: form.address,
        amount: amountNumber,
      };

      await axiosDeposit.post("/withdrawals/", payload);

      setMessage(`✅ ${t("withdraw.form.success")}`);
      setForm({ address: "", amount: "" });
    } catch (err) {
      setMessage(
        err.response?.data?.detail ||
          `❌ ${t("withdraw.form.errors.generic")}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!method) {
    return (
      <div className="withdraw-container">
        <p>{t("withdraw.noMethod")}</p>

        <motion.button
          className="back-button"
          onClick={() => navigate("/withdraw-methods")}
        >
          ← {t("withdraw.back")}
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div className="withdraw-container">
      <div className="withdraw-header">
        <img
          src={method.icon_url}
          alt={method.name}
          className="withdraw-method-icon"
        />

        <h2>{method.name}</h2>

        <p className="withdraw-country">
          {t("withdraw.country")} :{" "}
          {method.country || t("withdraw.noCountry")}
        </p>
      </div>

      <div className="withdraw-form">
        <input
          name="address"
          placeholder={t("withdraw.form.address")}
          value={form.address}
          onChange={handleChange}
        />

        <input
          name="amount"
          type="number"
          placeholder={t("withdraw.form.amount", { min: MIN_AMOUNT })}
          value={form.amount}
          onChange={handleChange}
        />

        <motion.button
          className="withdraw-button"
          disabled={submitting}
          onClick={handleSubmit}
        >
          {submitting
            ? t("withdraw.form.sending")
            : t("withdraw.form.submit")}
        </motion.button>
      </div>

      {message && <p className="withdraw-message">{message}</p>}

      <motion.button
        className="back-button"
        onClick={() => navigate("/withdraw-methods")}
      >
        ⬅ {t("withdraw.backMethods")}
      </motion.button>
    </motion.div>
  );
};

export default Retraits;