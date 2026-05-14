"use client";

import { useEffect } from "react";
import { FieldValues, UseFormReturn, useWatch } from "react-hook-form";
import { TemplateVariable } from "@/types/template";
import { DynamicField } from "./DynamicField";
import { FieldGroup } from "./FieldGroup";

interface DynamicFormProps {
  fields: TemplateVariable[];
  form: UseFormReturn<FieldValues>;
  onValuesChange: (values: FieldValues) => void;
}

export function DynamicForm({ fields, form, onValuesChange }: DynamicFormProps) {
  const values = useWatch({ control: form.control });

  useEffect(() => {
    onValuesChange(values);
  }, [values, onValuesChange]);

  // Group fields by a simple heuristic
  const groupedFields: Record<string, TemplateVariable[]> = {};
  fields.forEach((field) => {
    const group = "Information"; // Default group
    if (!groupedFields[group]) {
      groupedFields[group] = [];
    }
    groupedFields[group].push(field);
  });

  return (
    <form className="space-y-6">
      {Object.entries(groupedFields).map(([group, groupFields]) => (
        <FieldGroup key={group} title={group}>
          {groupFields.map((field) => (
            <DynamicField key={field.name} field={field} form={form} />
          ))}
        </FieldGroup>
      ))}
    </form>
  );
}
