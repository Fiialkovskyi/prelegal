"use client";

import { useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { TemplateSchema } from "@/types/template";
import { FormPanel } from "./FormPanel";
import { PreviewPanel } from "./PreviewPanel";

interface MobileTabSwitcherProps {
  template: TemplateSchema;
  templateContent: string;
  form: UseFormReturn<FieldValues>;
  values: FieldValues;
  onValuesChange: (values: FieldValues) => void;
  substituted: string;
  completion: number;
  onDownload: (id: string, values: FieldValues, filename: string) => Promise<void>;
  isLoading: boolean;
}

export function MobileTabSwitcher({
  template,
  form,
  values,
  onValuesChange,
  substituted,
  completion,
  onDownload,
  isLoading,
}: MobileTabSwitcherProps) {
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  return (
    <div className="flex flex-col h-screen">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-3 text-sm font-medium text-center ${
            activeTab === "form"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Form
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-3 text-sm font-medium text-center ${
            activeTab === "preview"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Preview
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "form" ? (
          <div className="h-full">
            <FormPanel
              templateId={template.id}
              templateName={template.name}
              fields={template.variables}
              form={form}
              values={values}
              onValuesChange={onValuesChange}
              onDownload={onDownload}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <div className="h-full">
            <PreviewPanel markdown={substituted} completion={completion} />
          </div>
        )}
      </div>
    </div>
  );
}
