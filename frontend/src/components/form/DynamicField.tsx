import { FieldValues, UseFormReturn } from "react-hook-form";
import { TemplateVariable } from "@/types/template";
import { TextField } from "./TextField";
import { DateField } from "./DateField";
import { TextareaField } from "./TextareaField";

interface DynamicFieldProps {
  field: TemplateVariable;
  form: UseFormReturn<FieldValues>;
}

export function DynamicField({ field, form }: DynamicFieldProps) {
  // Infer field type from name
  const getFieldType = (name: string): "text" | "date" | "textarea" => {
    const lower = name.toLowerCase();
    if (lower.includes("date") || lower.includes("effective") || lower.includes("term"))
      return "date";
    if (lower.includes("description") || lower.includes("note") || lower.includes("purpose"))
      return "textarea";
    return "text";
  };

  const type = getFieldType(field.name);

  switch (type) {
    case "date":
      return <DateField field={field} form={form} />;
    case "textarea":
      return <TextareaField field={field} form={form} />;
    default:
      return <TextField field={field} form={form} />;
  }
}
