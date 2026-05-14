import { Controller, FieldValues, UseFormReturn } from "react-hook-form";
import { TemplateVariable } from "@/types/template";
import { FieldError } from "./FieldError";

interface TextFieldProps {
  field: TemplateVariable;
  form: UseFormReturn<FieldValues>;
}

export function TextField({ field, form }: TextFieldProps) {
  return (
    <Controller
      name={field.name}
      control={form.control}
      defaultValue=""
      render={({ field: fieldProps, fieldState: { error } }) => (
        <div>
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
            {field.description || field.name}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          <input
            {...fieldProps}
            id={field.name}
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-50"
            placeholder={field.description || field.name}
          />
          <FieldError message={error?.message?.toString()} />
        </div>
      )}
    />
  );
}
