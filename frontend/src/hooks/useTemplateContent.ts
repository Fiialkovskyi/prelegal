import useSWR from "swr";
import { fetchTemplateContent } from "@/lib/api";

export function useTemplateContent(id: string) {
  const { data, error, isLoading } = useSWR<string>(
    id ? `content/${id}` : null,
    () => fetchTemplateContent(id),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    content: data,
    isLoading,
    error,
  };
}
