import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        inputRef.current &&
        document.activeElement !== inputRef.current
      ) {
        e.preventDefault();
        inputRef.current.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex gap-2">
      <div className="absolute left-3 top-1/2 -translate-y-1/2">
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-100 px-1.5 font-mono text-[10px] font-medium opacity-100 text-gray-600">
          /
        </kbd>
      </div>
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder ?? "Type your message..."}
        disabled={disabled}
        className="flex-1 pl-10 pr-16 py-6 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500 transition-colors"
      />
      <Button
        type="submit"
        disabled={disabled || !message.trim()}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-2 h-auto"
      >
        {disabled ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
}
