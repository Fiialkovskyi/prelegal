"use client";

import { useTemplate } from "@/hooks/useTemplate";
import { useTemplateContent } from "@/hooks/useTemplateContent";
import { EditorLayout } from "@/components/editor/EditorLayout";

interface TemplatePageProps {
  params: {
    id: string;
  };
}

export default function TemplatePage({ params }: TemplatePageProps) {
  const { template, isLoading: schemaLoading, error: schemaError } = useTemplate(params.id);
  const { content, isLoading: contentLoading, error: contentError } = useTemplateContent(params.id);

  const isLoading = schemaLoading || contentLoading;
  const error = schemaError || contentError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <p className="text-gray-500">Loading template...</p>
      </div>
    );
  }

  if (error || !template || !content) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <p className="text-red-600 font-semibold">Failed to load template</p>
          <p className="text-gray-500 mt-2">
            <a href="/templates" className="text-blue-600 hover:underline">
              Go back to templates
            </a>
          </p>
        </div>
      </div>
    );
  }

  return <EditorLayout template={template} templateContent={content} />;
}
