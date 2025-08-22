import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  disabled?: boolean;
}

export const FileUpload = ({ onFileSelect, selectedFile, disabled }: FileUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type === "application/pdf") {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      onFileSelect(file);
    }
  };

  const handleRemoveFile = () => {
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4 border-t border-border bg-card/50">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          {selectedFile ? (
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg border border-border">
              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-secondary-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
                className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-6 text-center transition-smooth cursor-pointer",
                isDragOver 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50 hover:bg-primary/5",
                disabled && "opacity-50 cursor-not-allowed pointer-events-none"
              )}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={openFileDialog}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={disabled}
              />
              <Upload className={cn(
                "w-8 h-8 mx-auto mb-2 transition-smooth",
                isDragOver ? "text-primary" : "text-muted-foreground"
              )} />
              <p className={cn(
                "text-sm font-medium transition-smooth",
                isDragOver ? "text-primary" : "text-foreground"
              )}>
                {isDragOver ? "Drop PDF here" : "Upload PDF to analyze"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click or drag & drop • PDF only
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};