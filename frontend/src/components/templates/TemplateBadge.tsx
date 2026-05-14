interface TemplateBadgeProps {
  name: string;
}

export function TemplateBadge({ name }: TemplateBadgeProps) {
  const getType = () => {
    const upper = name.toUpperCase();
    if (upper.includes("NDA")) return "NDA";
    if (upper.includes("SLA")) return "SLA";
    if (upper.includes("DPA")) return "DPA";
    if (upper.includes("BAA")) return "BAA";
    if (upper.includes("CSA")) return "CSA";
    if (upper.includes("PSA")) return "PSA";
    if (upper.includes("PARTNERSHIP")) return "Partnership";
    if (upper.includes("LICENSE")) return "License";
    return "Docs";
  };

  const type = getType();
  const colors: Record<string, string> = {
    NDA: "bg-blue-100 text-blue-800",
    SLA: "bg-green-100 text-green-800",
    DPA: "bg-purple-100 text-purple-800",
    BAA: "bg-orange-100 text-orange-800",
    CSA: "bg-pink-100 text-pink-800",
    PSA: "bg-indigo-100 text-indigo-800",
    Partnership: "bg-yellow-100 text-yellow-800",
    License: "bg-gray-100 text-gray-800",
    Docs: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${colors[type] || colors.Docs}`}>
      {type}
    </span>
  );
}
