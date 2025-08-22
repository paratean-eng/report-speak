import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string;
    status?: string;
  };
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex gap-3 p-4 transition-smooth",
      message.isUser ? "justify-end" : "justify-start"
    )}>
      {!message.isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
      
      <div className={cn(
        "max-w-[70%] rounded-2xl px-4 py-3 shadow-soft transition-smooth",
        message.isUser 
          ? "chat-message-user rounded-br-md" 
          : "chat-message-ai rounded-bl-md"
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.text}
        </p>
        {message.status && !message.isUser && (
          <div className="mt-2 text-xs opacity-70">
            Status: {message.status}
          </div>
        )}
        <div className={cn(
          "text-xs mt-2 opacity-60",
          message.isUser ? "text-right" : "text-left"
        )}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
      
      {message.isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};