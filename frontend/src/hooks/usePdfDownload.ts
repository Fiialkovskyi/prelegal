import { useState } from "react";
import { downloadTemplatePdf, ApiError } from "@/lib/api";
import { FieldValues } from "@/types/template";

export function usePdfDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const download = async (id: string, values: FieldValues, filename: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const blob = await downloadTemplatePdf(id, values);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to download PDF";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    download,
    isLoading,
    error,
  };
}
