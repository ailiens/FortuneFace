import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadAreaProps {
  onImageUpload: (file: File) => void;
  imagePreview?: string | null;
  onRemoveImage: () => void;
}

export function UploadArea({ onImageUpload, imagePreview, onRemoveImage }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "잘못된 파일 형식",
        description: "이미지 파일만 업로드 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "파일 크기 초과",
        description: "파일 크기는 10MB 이하로 제한됩니다.",
        variant: "destructive",
      });
      return;
    }

    onImageUpload(file);
  };

  if (imagePreview) {
    return (
      <Card className="bg-gray-50 rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium korean-charcoal">업로드된 이미지</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemoveImage}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <img 
            src={imagePreview} 
            alt="Uploaded face preview"
            className="w-32 h-32 object-cover rounded-lg mx-auto shadow-md"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div 
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
          isDragOver 
            ? 'border-korean-brown bg-korean-cream' 
            : 'border-korean-cream hover:border-korean-brown'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleFileSelect}
      >
        <div className="animate-pulse-gentle">
          <Upload className="w-12 h-12 korean-bronze mx-auto mb-4" />
        </div>
        <p className="text-lg font-medium korean-brown mb-2">
          사진을 여기에 드래그하거나 클릭하세요
        </p>
        <p className="text-sm text-gray-500 mb-4">
          JPG, PNG 파일만 지원됩니다 (최대 10MB)
        </p>
        <Button 
          type="button"
          className="bg-korean-bronze hover:bg-korean-bronze/90 text-white px-6 py-2 rounded-lg font-medium"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          파일 선택
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </>
  );
}
