"use client";

import { MutualNDAForm } from "@/components/MutualNDAForm";

export default function CreateDocumentPage({
  params,
}: {
  params: { templateId: string };
}) {
  return <MutualNDAForm templateId={params.templateId} />;
}
