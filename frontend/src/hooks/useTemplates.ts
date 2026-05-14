import useSWR from "swr";
import { fetchTemplates } from "@/lib/api";
import { TemplateSummary } from "@/types/template";

export function useTemplates() {
  const { data, error, isLoading } = useSWR<TemplateSummary[]>(
    "templates",
    () => fetchTemplates(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    templates: data,
    isLoading,
    error,
  };
}
