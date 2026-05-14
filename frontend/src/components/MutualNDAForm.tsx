"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE = "http://localhost:8000";

interface FormField {
  name: string;
  value: string;
}

interface Template {
  id: string;
  name: string;
  variables: Array<{
    name: string;
    source: string;
    occurrences: number;
    required: boolean;
  }>;
}

interface MutualNDAFormProps {
  documentId?: number;
  templateId: string;
}

export function MutualNDAForm({
  documentId,
  templateId,
}: MutualNDAFormProps) {
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [preview, setPreview] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  useEffect(() => {
    generatePreview();
  }, [fields]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/templates/${templateId}/schema`);
      if (!response.ok) throw new Error("Failed to fetch template");
      const templateData = await response.json();
      setTemplate(templateData);

      // Initialize form fields from template variables
      const initialFields = templateData.variables.map((v: any) => ({
        name: v.name,
        value: "",
      }));
      setFields(initialFields);
    } catch {
      setError("Failed to load template");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePreview = async () => {
    if (!template) return;

    try {
      const response = await fetch(
        `${API_BASE}/api/v1/templates/${templateId}/content`
      );
      if (!response.ok) return;
      const data = await response.json();
      let content = data.content;

      // Replace variables with form values
      fields.forEach((field) => {
        const pattern = new RegExp(`\\[${field.name}\\]`, "g");
        content = content.replace(pattern, field.value || `[${field.name}]`);
      });

      setPreview(content);
    } catch {
      // Silent fail for preview
    }
  };

  const handleFieldChange = (index: number, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index].value = value;
    setFields(updatedFields);
  };

  const handleSave = async () => {
    if (!documentName.trim()) {
      setError("Please enter a document name");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const content = JSON.stringify(
        fields.reduce(
          (acc, field) => {
            acc[field.name] = field.value;
            return acc;
          },
          {} as Record<string, string>
        )
      );

      if (documentId) {
        await fetch(`${API_BASE}/api/documents/${documentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ name: documentName, content }),
        });
      } else {
        await fetch(`${API_BASE}/api/documents`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: documentName,
            template_id: templateId,
            content,
          }),
        });
      }

      router.push("/app/documents");
    } catch {
      setError("Failed to save document");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/api/v1/templates/${templateId}/pdf`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            values: fields.reduce(
              (acc, field) => {
                acc[field.name] = field.value;
                return acc;
              },
              {} as Record<string, string>
            ),
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${documentName || template?.name || "document"}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to generate PDF");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading template...</div>;
  }

  if (!template) {
    return <div className="text-red-600">Template not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 gap-8 px-6">
        {/* Form Section */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {template.name}
          </h2>

          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Name
              </label>
              <input
                type="text"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="e.g., NDA with Acme Corp"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Form Fields</h3>
              {fields.map((field, index) => (
                <div key={index} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {field.name}
                  </label>
                  <input
                    type="text"
                    value={field.value}
                    onChange={(e) => handleFieldChange(index, e.target.value)}
                    placeholder={`Enter ${field.name.toLowerCase()}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>

            <div className="border-t pt-4 flex gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Document"}
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="sticky top-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Preview</h3>
          <div className="bg-white rounded-lg shadow p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm text-gray-800">
              {preview || "Preview will appear here..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
