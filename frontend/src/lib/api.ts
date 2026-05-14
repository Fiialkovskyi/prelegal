import { TemplateSummary, TemplateSchema } from "@/types/template";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text().catch(() => "Unknown error");
    throw new ApiError(response.status, error);
  }

  return response.json();
}

export async function fetchTemplates(): Promise<TemplateSummary[]> {
  return fetchApi("/api/v1/templates");
}

export async function fetchTemplate(id: string): Promise<TemplateSchema> {
  return fetchApi(`/api/v1/templates/${id}/schema`);
}

export async function fetchTemplateContent(id: string): Promise<string> {
  const response = await fetchApi<{ content: string }>(`/api/v1/templates/${id}/content`);
  return response.content;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  message: string;
  extracted_values: Record<string, string>;
  is_complete: boolean;
}

export async function getChatGreeting(): Promise<ChatResponse> {
  const greeting = await fetchApi<{ message: string }>("/api/chat/greeting");
  return { message: greeting.message, extracted_values: {}, is_complete: false };
}

export async function sendChatMessage(
  messages: ChatMessage[],
  currentValues: Record<string, string>
): Promise<ChatResponse> {
  return fetchApi<ChatResponse>("/api/chat/message", {
    method: "POST",
    body: JSON.stringify({ messages, current_values: currentValues }),
  });
}

export async function downloadTemplatePdf(
  id: string,
  values: Record<string, string>
): Promise<Blob> {
  const url = `${API_URL}/api/v1/templates/${id}/pdf`;
  const response = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) {
    throw new ApiError(response.status, "Failed to generate PDF");
  }

  return response.blob();
}
