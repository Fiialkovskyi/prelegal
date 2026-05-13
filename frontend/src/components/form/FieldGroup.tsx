import { ReactNode } from "react";

interface FieldGroupProps {
  title?: string;
  children: ReactNode;
}

export function FieldGroup({ title, children }: FieldGroupProps) {
  return (
    <div className="space-y-4">
      {title && <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>}
      <div className="space-y-4">{children}</div>
    </div>
  );
}
