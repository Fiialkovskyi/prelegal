"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { FieldValues } from "react-hook-form";
import { TemplateSchema } from "@/types/template";
import { FormPanel } from "./FormPanel";
import { PreviewPanel } from "./PreviewPanel";
import { MobileTabSwitcher } from "./MobileTabSwitcher";
import { useTemplatePreview } from "@/hooks/useTemplatePreview";
import { usePdfDownload } from "@/hooks/usePdfDownload";

interface EditorLayoutProps {
  template: TemplateSchema;
  templateContent: string;
}

export function EditorLayout({ template, templateContent }: EditorLayoutProps) {
  const form = useForm<FieldValues>({
    defaultValues: Object.fromEntries(template.variables.map((v) => [v.name, ""])),
  });

  const [values, setValues] = useState<FieldValues>(form.getValues());
  const { substituted, completion } = useTemplatePreview(
    templateContent,
    values,
    template.variables
  );
  const { download, isLoading } = usePdfDownload();

  const handleValuesChange = (newValues: FieldValues) => {
    setValues(newValues);
  };

  const handleDownload = async (id: string, vals: FieldValues, filename: string) => {
    await download(id, vals, filename);
  };

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[minmax(360px,420px)_1fr] h-screen">
        <FormPanel
          templateId={template.id}
          templateName={template.name}
          fields={template.variables}
          form={form}
          values={values}
          onValuesChange={handleValuesChange}
          onDownload={handleDownload}
          isLoading={isLoading}
        />
        <PreviewPanel markdown={substituted} completion={completion} />
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-screen">
        <MobileTabSwitcher
          template={template}
          templateContent={templateContent}
          form={form}
          values={values}
          onValuesChange={handleValuesChange}
          substituted={substituted}
          completion={completion}
          onDownload={handleDownload}
          isLoading={isLoading}
        />
      </div>
    </>
  );
}
