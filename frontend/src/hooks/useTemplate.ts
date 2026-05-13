import useSWR from "swr";
import { fetchTemplate } from "@/lib/api";
import { TemplateSchema } from "@/types/template";

export function useTemplate(id: string) {
  const { data, error, isLoading } = useSWR<TemplateSchema>(
    id ? `template/${id}` : null,
    () => fetchTemplate(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    template: data,
    isLoading,
    error,
  };
}
