import React from "react";
import { Button } from "./ui/button"; // corrigé
import { Input } from "./ui/input";   // corrigé
import { Copy } from "lucide-react";

const ReferralSection = ({ referralLink, referralCount }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
  };

  return (
    <div className="mt-6 space-y-2">
      <h3 className="text-lg font-semibold">Parrainage</h3>
      <p className="text-sm text-gray-600">
        Tu as <strong>{referralCount}</strong> filleul{referralCount > 1 ? "s" : ""}.
      </p>
      <div className="flex gap-2">
        <Input readOnly value={referralLink} className="truncate" />
        <Button onClick={handleCopy} variant="outline" size="icon">
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ReferralSection;
