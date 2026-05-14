import { useMemo } from "react";
import { substituteVariables, getCompletionPercentage } from "@/lib/substituteVariables";
import { FieldValues, TemplateVariable } from "@/types/template";

export function useTemplatePreview(
  content: string | undefined,
  values: FieldValues,
  variables: TemplateVariable[] = []
) {
  const substituted = useMemo(() => {
    if (!content) return "";
    return substituteVariables(content, values, { highlightEmpty: true });
  }, [content, values]);

  const completion = useMemo(() => {
    const requiredVars = variables.filter((v) => v.required).map((v) => v.name);
    return getCompletionPercentage(requiredVars, values);
  }, [variables, values]);

  return {
    substituted,
    completion,
  };
}
