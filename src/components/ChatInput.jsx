import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";

export const ChatInput = ({ onSendMessage, isLoading, disabled }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4">
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me to analyze a PDF or just chat..."
          className={cn(
            "flex min-h-12 max-h-32 w-full rounded-md border-2 border-border bg-card px-3 py-2 text-sm resize-none transition-smooth",
            "focus:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "placeholder:text-muted-foreground text-card-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled || isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={!message.trim() || isLoading || disabled}
        className={cn(
          "self-end inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "gradient-primary hover:opacity-90 transition-smooth",
          "shadow-medium hover:shadow-strong h-10 w-10",
          "disabled:opacity-50 disabled:cursor-not-allowed text-white"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </button>
    </form>
  );
};