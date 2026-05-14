"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";

interface Document {
  id: number;
  name: string;
  template_id: string;
  created_at: string;
}

export default function AppHome() {
  const router = useRouter();
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentDocuments();
  }, []);

  const fetchRecentDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/documents`, {
        credentials: "include",
      });
      if (response.ok) {
        const docs = await response.json();
        setRecentDocuments(docs.slice(0, 5));
      }
    } catch {
      // Fail silently
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600 mb-8">
          Create professional legal documents with our templates
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create New Document */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Create New Document
            </h2>
            <p className="text-gray-600 mb-6">
              Start creating a professional legal document from our template
              library
            </p>
            <button
              onClick={() => router.push("/app/create")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg"
            >
              Browse Templates
            </button>
          </div>

          {/* My Documents */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              My Documents
            </h2>
            <p className="text-gray-600 mb-6">
              View and manage your saved legal documents
            </p>
            <button
              onClick={() => router.push("/app/documents")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg"
            >
              View All Documents
            </button>
          </div>
        </div>

        {/* Recent Documents */}
        {!isLoading && recentDocuments.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Documents
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {doc.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {doc.template_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            router.push(`/app/edit/${doc.id}`)
                          }
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
