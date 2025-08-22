import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../components/ChatMessage";
import { ChatInput } from "../components/ChatInput";
import { FileUpload } from "../components/FileUpload";
import { Bot, FileText } from "lucide-react";
import axios from "axios";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. Upload a PDF and ask me to analyze it, or just start chatting!",
      isUser: false,
      timestamp: new Date().toISOString(),
      status: "ready"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    const userMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("user_query", text);
      formData.append("user_id", "p123");
      
      if (selectedFile) {
        formData.append("pdf_file", selectedFile);
      }

      const response = await axios.post("http://localhost:8000/ask", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || "I received your message but couldn't generate a response.",
        isUser: false,
        timestamp: new Date().toISOString(),
        status: data.status,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Clear file after successful analysis if it was used
      if (selectedFile && data.status === "done") {
        setSelectedFile(null);
      }

    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting to the server. Please make sure your FastAPI backend is running on http://localhost:8000",
        isUser: false,
        timestamp: new Date().toISOString(),
        status: "error",
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chat-bg flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-soft">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AI PDF Analyzer</h1>
              <p className="text-sm text-muted-foreground">
                Upload PDFs and chat with AI for intelligent analysis
              </p>
            </div>
            {selectedFile && (
              <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <FileText className="w-4 h-4" />
                PDF Ready
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border shadow-strong">
        <div className="max-w-4xl mx-auto">
          <FileUpload 
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
            disabled={isLoading}
          />
          <ChatInput
            onSendMessage={sendMessage}
            isLoading={isLoading}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
}