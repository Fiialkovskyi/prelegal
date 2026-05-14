export type VariableSource = "coverpage_link" | "keyterms_link" | "orderform_link" | "businessterms_link" | "sow_link" | "bracket";

export interface TemplateVariable {
  name: string;
  source: VariableSource;
  occurrences: number;
  required: boolean;
  description?: string;
}

export interface TemplateSummary {
  id: string;
  filename: string;
  name: string;
  description: string;
  variable_count: number;
  variable_sources: VariableSource[];
}

export interface TemplateSchema {
  id: string;
  filename: string;
  name: string;
  description: string;
  variables: TemplateVariable[];
  related_filenames: string[];
}

export type FieldValues = Record<string, string>;
