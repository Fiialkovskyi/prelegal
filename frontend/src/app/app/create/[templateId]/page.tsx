"use client";

import { useEffect, useState } from "react";
import { FieldValues, TemplateSchema } from "@/types/template";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { PreviewPanel } from "@/components/editor/PreviewPanel";
import { useTemplatePreview } from "@/hooks/useTemplatePreview";
import { usePdfDownload } from "@/hooks/usePdfDownload";
import { fetchTemplate, fetchTemplateContent } from "@/lib/api";

export default function CreateDocumentPage({
  params,
}: {
  params: { templateId: string };
}) {
  const [template, setTemplate] = useState<TemplateSchema | null>(null);
  const [templateContent, setTemplateContent] = useState("");
  const [values, setValues] = useState<FieldValues>({});
  const { download, isLoading: isDownloadLoading } = usePdfDownload();

  const { substituted, completion } = useTemplatePreview(
    templateContent,
    values,
    template?.variables ?? []
  );

  useEffect(() => {
    Promise.all([
      fetchTemplate(params.templateId),
      fetchTemplateContent(params.templateId),
    ]).then(([templateData, content]) => {
      setTemplate(templateData);
      setTemplateContent(content);
      setValues(
        Object.fromEntries(templateData.variables.map((v) => [v.name, ""]))
      );
    });
  }, [params.templateId]);

  if (!template) {
    return (
      <div className="flex items-center justify-center h-screen text-[#888888]">
        Loading template...
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(360px,420px)_1fr] h-screen">
      <ChatPanel
        templateId={template.id}
        templateName={template.name}
        variables={template.variables}
        values={values}
        onValuesChange={setValues}
        onDownload={download}
        isDownloadLoading={isDownloadLoading}
      />
      <PreviewPanel markdown={substituted} completion={completion} />
    </div>
  );
}
