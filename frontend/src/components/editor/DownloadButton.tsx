"use client";

import { FieldValues } from "react-hook-form";

interface DownloadButtonProps {
  templateId: string;
  templateName: string;
  values: FieldValues;
  isLoading: boolean;
  isDisabled: boolean;
  onDownload: (id: string, values: FieldValues, filename: string) => Promise<void>;
}

export function DownloadButton({
  templateId,
  templateName,
  values,
  isLoading,
  isDisabled,
  onDownload,
}: DownloadButtonProps) {
  const handleClick = async () => {
    const filename = `${templateName.replace(/\s+/g, "-").toLowerCase()}.pdf`;
    await onDownload(templateId, values, filename);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled || isLoading}
      className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? "Generating PDF..." : "Download PDF"}
    </button>
  );
}
