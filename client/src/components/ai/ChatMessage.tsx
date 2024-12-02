import { MessageCircle, Bot } from "lucide-react";
import { cn } from "../../lib/utils";

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isBot, timestamp }: ChatMessageProps) {
  const formattedMessage = message.split("\n").map((line, i) => (
    <p
      key={i}
      className={cn(
        "text-sm",
        line.startsWith("-") ? "pl-4 text-gray-700" : "text-gray-900",
        i > 0 ? "mt-2" : ""
      )}
    >
      {line}
    </p>
  ));

  return (
    <div
      className={cn(
        "group flex gap-3 p-4 rounded-xl transition-colors",
        isBot
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100"
          : "bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110",
          isBot
            ? "bg-gradient-to-br from-blue-500 to-indigo-600"
            : "bg-gradient-to-br from-emerald-500 to-teal-600"
        )}
      >
        {isBot ? (
          <Bot className="w-4 h-4 text-white" />
        ) : (
          <MessageCircle className="w-4 h-4 text-white" />
        )}
      </div>
      <div className="flex-1 space-y-1">
        <div className="prose prose-sm max-w-none">{formattedMessage}</div>
        <p className="text-xs text-gray-500 opacity-70 group-hover:opacity-100 transition-opacity">
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
