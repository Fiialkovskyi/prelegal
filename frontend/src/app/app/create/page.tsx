"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

interface Template {
  id: string;
  name: string;
  description: string;
}

export default function CreatePage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/v1/templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch {
      // Fail silently
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    router.push(`/app/create/${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Select a Template
        </h1>
        <p className="text-gray-600 mb-8">
          Choose a template to start creating your document
        </p>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <p className="text-gray-500">Loading templates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleSelectTemplate(template.id)}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {template.description}
                  </p>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg">
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
