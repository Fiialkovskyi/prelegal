"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { FieldValues, TemplateVariable } from "@/types/template";
import { getChatGreeting, sendChatMessage, ChatMessage } from "@/lib/api";

interface ChatPanelProps {
  templateId: string;
  templateName: string;
  variables: TemplateVariable[];
  values: FieldValues;
  onValuesChange: (values: FieldValues) => void;
  onDownload: (id: string, values: FieldValues, filename: string) => Promise<void>;
  isDownloadLoading: boolean;
}

export function ChatPanel({
  templateId,
  templateName,
  variables,
  values,
  onValuesChange,
  onDownload,
  isDownloadLoading,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const valuesRef = useRef(values);

  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  useEffect(() => {
    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiLoading]);

  const SYNTHETIC_GREETING = "Hi, I need to create a Mutual NDA.";

  const initChat = async () => {
    setIsAiLoading(true);
    try {
      const result = await getChatGreeting();
      // Include synthetic user turn so conversation history is well-formed for subsequent calls
      setMessages([
        { role: "user", content: SYNTHETIC_GREETING },
        { role: "assistant", content: result.message },
      ]);
    } catch {
      setMessages([
        { role: "user", content: SYNTHETIC_GREETING },
        { role: "assistant", content: `Hello! I'm here to help you create a ${templateName}. Let's start — what is the purpose of the agreement?` },
      ]);
    } finally {
      setIsAiLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isAiLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsAiLoading(true);

    // Use ref to get latest values, avoiding stale closure across async gap
    const currentValues = valuesRef.current;

    try {
      const result = await sendChatMessage(updatedMessages, currentValues);
      setMessages([...updatedMessages, { role: "assistant", content: result.message }]);
      if (result.extracted_values && Object.keys(result.extracted_values).length > 0) {
        onValuesChange({ ...currentValues, ...result.extracted_values });
      }
      setIsComplete(result.is_complete);
    } catch {
      setMessages([...updatedMessages, { role: "assistant", content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsAiLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const requiredFields = variables.filter((v) => v.required);
  const filledCount = requiredFields.filter((v) => values[v.name]).length;

  return (
    <div className="h-screen flex flex-col bg-gray-50 border-r border-gray-200 overflow-hidden">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <h2 className="font-semibold text-[#032147]">AI Document Assistant</h2>
        <p className="text-xs text-[#888888] mt-1">
          {filledCount} of {requiredFields.length} fields complete
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#209dd7] text-white"
                  : "bg-white border border-gray-200 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isAiLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-[#888888]">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {isComplete && (
        <div className="px-4 py-3 bg-green-50 border-t border-green-200">
          <button
            onClick={() =>
              onDownload(
                templateId,
                values,
                `${templateName.replace(/\s+/g, "-").toLowerCase()}.pdf`
              )
            }
            disabled={isDownloadLoading}
            className="w-full bg-[#753991] hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 text-sm transition-colors"
          >
            {isDownloadLoading ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>
      )}

      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response..."
            disabled={isAiLoading}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#209dd7] focus:border-[#209dd7] disabled:bg-gray-50 disabled:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={isAiLoading || !input.trim()}
            className="bg-[#209dd7] hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
