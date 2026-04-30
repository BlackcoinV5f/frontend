import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaCoins,
  FaWallet,
  FaArrowLeft,
} from "react-icons/fa";
import { useUser } from "../contexts/UserContext";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import "./ValidateTask.css";

const ValidateTask = () => {
  // ✅ namespace correct
  const { t } = useTranslation("tasks");

  const { taskId } = useParams();
  const navigate = useNavigate();
  const { axiosInstance, user } = useUser();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rewardDetails, setRewardDetails] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const res = await axiosInstance.get("/tasks/");
      return res.data.find(
        (t) => String(t.id) === String(taskId)
      );
    },
    enabled: !!user && !!taskId,
  });

  // =========================
  // 🔄 REDIRECTION SUCCESS
  // =========================
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => navigate("/tasks"), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  // =========================
  // ✅ VALIDATION
  // =========================
  const handleValidation = async () => {
    if (!code.trim()) {
      setError(t("validatePage.empty_code"));
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const res = await axiosInstance.post(
        `/tasks/${taskId}/validate`,
        { code }
      );

      setRewardDetails(res.data.reward);
      setIsSuccess(true);
    } catch (err) {
      if (err.response?.status === 400) {
        setError(t("validatePage.invalid_code"));
      } else if (err.response?.status === 401) {
        setError(t("validatePage.unauthorized"));
      } else {
        setError(t("validatePage.error"));
      }
    } finally {
      setIsValidating(false);
    }
  };

  // =========================
  // ❌ NOT LOGGED
  // =========================
  if (!user) {
    return (
      <div className="validate-container">
        {t("validatePage.login_required")}
      </div>
    );
  }

  // =========================
  // ⏳ LOADING
  // =========================
  if (isLoading) {
    return (
      <div className="validate-container">
        {t("validatePage.loading", "Chargement...")}
      </div>
    );
  }

  // =========================
  // ❌ ERROR / NOT FOUND
  // =========================
  if (isError || !data) {
    return (
      <div className="validate-container error">
        <p>{t("validatePage.not_found")}</p>
        <button onClick={() => navigate("/tasks")}>
          {t("validatePage.back_tasks")}
        </button>
      </div>
    );
  }

  const task = data;

  // =========================
  // 🧱 RENDER
  // =========================
  return (
    <div className="validate-container">
      <button onClick={() => navigate("/tasks")}>
        <FaArrowLeft /> {t("validatePage.back")}
      </button>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <div className="success-container">
            <FaCheck size={60} />
            <h2>{t("validatePage.success")}</h2>

            <div>
              <div>
                <FaCoins /> +{rewardDetails?.balance}{" "}
                {t("validatePage.points")}
              </div>
              <div>
                <FaWallet /> +{rewardDetails?.bonus}{" "}
                {t("validatePage.points")}
              </div>
              <div>
                {t("validatePage.total", {
                  amount: rewardDetails?.total,
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="validation-form">
            <h2>{t("validatePage.title")}</h2>

            <p>{t("validatePage.instructions")}</p>

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t("validatePage.placeholder")}
            />

            {error && (
              <p>
                <FaTimes /> {error}
              </p>
            )}

            <button onClick={handleValidation} disabled={isValidating}>
              {isValidating ? (
                <span className="spinner"></span>
              ) : (
                <>
                  <FaCheck /> {t("validatePage.submit")}
                </>
              )}
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValidateTask;