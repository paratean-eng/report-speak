import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, isLoading, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 p-4">
      <div className="flex-1">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me to analyze a PDF or just chat..."
          className={cn(
            "min-h-12 max-h-32 resize-none transition-smooth",
            "border-2 border-border focus:border-primary",
            "bg-card text-card-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled || isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={!message.trim() || isLoading || disabled}
        className={cn(
          "self-end gradient-primary hover:opacity-90 transition-smooth",
          "shadow-medium hover:shadow-strong",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        size="icon"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
};