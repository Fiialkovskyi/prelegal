"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MutualNDAForm } from "@/components/MutualNDAForm";

interface Document {
  id: number;
  name: string;
  template_id: string;
  content: string;
}

export default function EditPage({ params }: { params: { docId: string } }) {
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocument();
  }, [params.docId]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`/api/documents/${params.docId}`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      } else {
        router.push("/app/documents");
      }
    } catch {
      router.push("/app/documents");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading document...</p>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <MutualNDAForm
      documentId={parseInt(params.docId)}
      templateId={document.template_id}
    />
  );
}
