import React from "react";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import AssetCard from "../components/AssetCard.jsx";
import { useTranslation } from "react-i18next";
import { useMyAssets } from "../hooks/useMyasset";
import "./MyAssets.css";

const MyAssets = () => {
  const { t } = useTranslation("premium");

  const {
    data: assets = [],
    isLoading,
    error,
  } = useMyAssets();

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <div className="my-assets-page">
      <div className="assets-card">
        <h2 className="title">{t("actions.myAssetsTitle")}</h2>

        {error && (
          <p className="error">{t("actions.fetchError")}</p>
        )}

        {!error && assets.length === 0 ? (
          <p className="no-assets">{t("actions.noAssets")}</p>
        ) : (
          <div className="assets-grid">
            {assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssets;