"use client";

import { FieldValues, UseFormReturn } from "react-hook-form";
import { TemplateVariable } from "@/types/template";
import { DynamicForm } from "@/components/form/DynamicForm";
import { DownloadButton } from "./DownloadButton";

interface FormPanelProps {
  templateId: string;
  templateName: string;
  fields: TemplateVariable[];
  form: UseFormReturn<FieldValues>;
  values: FieldValues;
  onValuesChange: (values: FieldValues) => void;
  onDownload: (id: string, values: FieldValues, filename: string) => Promise<void>;
  isLoading: boolean;
}

export function FormPanel({
  templateId,
  templateName,
  fields,
  form,
  values,
  onValuesChange,
  onDownload,
  isLoading,
}: FormPanelProps) {
  const requiredFields = fields.filter((f) => f.required);
  const filledRequired = requiredFields.filter((f) => values[f.name]);
  const canDownload = filledRequired.length === requiredFields.length;

  return (
    <div className="h-screen flex flex-col bg-gray-50 border-r border-gray-200 overflow-hidden">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h2 className="font-semibold text-gray-900">Fill in Information</h2>
        <p className="text-xs text-gray-500 mt-1">{filledRequired.length} of {requiredFields.length} required</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <DynamicForm fields={fields} form={form} onValuesChange={onValuesChange} />
      </div>

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <DownloadButton
          templateId={templateId}
          templateName={templateName}
          values={values}
          isLoading={isLoading}
          isDisabled={!canDownload}
          onDownload={onDownload}
        />
      </div>
    </div>
  );
}
