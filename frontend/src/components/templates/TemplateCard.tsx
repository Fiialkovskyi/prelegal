import Link from "next/link";
import { TemplateSummary } from "@/types/template";
import { TemplateBadge } from "./TemplateBadge";

interface TemplateCardProps {
  template: TemplateSummary;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Link href={`/templates/${template.id}`}>
      <div className="h-full bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer border border-gray-200">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 flex-1 pr-2">{template.name}</h3>
          <TemplateBadge name={template.name} />
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
        <div className="text-xs text-gray-500">{template.variable_count} fields</div>
      </div>
    </Link>
  );
}
