"use client";

import ReactMarkdown from "react-markdown";
import RemarkGfm from "remark-gfm";
import RehypeRaw from "rehype-raw";

interface PreviewPanelProps {
  markdown: string;
  completion: number;
}

export function PreviewPanel({ markdown, completion }: PreviewPanelProps) {
  return (
    <div className="h-screen flex flex-col bg-white border-l border-gray-200 overflow-hidden">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Preview</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">{completion}%</span>
            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="prose prose-sm max-w-none p-6 [&_span[data-empty='true']]:bg-yellow-100 [&_span[data-empty='true']]:text-yellow-800 [&_span[data-empty='true']]:px-1 [&_span[data-empty='true']]:rounded [&_span[data-empty='true']]:text-xs">
          <ReactMarkdown
            remarkPlugins={[RemarkGfm]}
            rehypePlugins={[RehypeRaw]}
            components={{
              table: ({ children }) => (
                <table className="w-full border-collapse">{children}</table>
              ),
              td: ({ children }) => <td className="border border-gray-300 p-2">{children}</td>,
              th: ({ children }) => (
                <th className="border border-gray-300 p-2 bg-gray-100">{children}</th>
              ),
            }}
          >
            {markdown}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
