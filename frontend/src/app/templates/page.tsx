"use client";

import { useTemplates } from "@/hooks/useTemplates";
import { TemplateGrid } from "@/components/templates/TemplateGrid";

export default function TemplatesPage() {
  const { templates, isLoading, error } = useTemplates();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Legal Document Templates</h1>
          <p className="text-gray-600 mt-2">Choose a template to create your document</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <p className="text-gray-500">Loading templates...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Failed to load templates. Please refresh the page.
          </div>
        )}

        {templates && <TemplateGrid templates={templates} />}
      </div>
    </div>
  );
}
