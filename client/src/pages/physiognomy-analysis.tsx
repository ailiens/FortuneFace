import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UploadArea } from "@/components/upload-area";
import { AnalysisResults } from "@/components/analysis-results";
import { useFaceAnalysis } from "@/hooks/use-face-analysis";
import { User, Camera, Brain, Share, Download, RotateCcw, Eye, Mountain, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";

export default function PhysiognomyAnalysis() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { analyzeImage, analysisResults, isAnalyzing, error } = useFaceAnalysis();

  useEffect(() => {
    // Load face-api.js models when component mounts
    import("@/lib/face-analysis").then(({ initializeFaceAPI }) => {
      initializeFaceAPI();
    });
  }, []);

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalysis = async () => {
    if (!uploadedImage) {
      toast({
        title: "이미지를 선택해주세요",
        description: "분석할 얼굴 사진을 먼저 업로드해주세요.",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep(2);
    
    try {
      await analyzeImage(uploadedImage, selectedGender);
      setCurrentStep(3);
      toast({
        title: "분석 완료",
        description: "관상 분석이 성공적으로 완료되었습니다.",
      });
    } catch (err) {
      toast({
        title: "분석 실패",
        description: "얼굴 분석 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
      setCurrentStep(1);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentStep(1);
    setSelectedGender(null);
    setUploadedImage(null);
    setImagePreview(null);
  };

  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (!analysisResults) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI 관상 분석 결과',
          text: `AI 관상 분석 결과: ${analysisResults.overall.summary}`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast({
          title: "링크 복사됨",
          description: "결과 링크가 클립보드에 복사되었습니다.",
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "링크 복사됨",
        description: "결과 링크가 클립보드에 복사되었습니다.",
      });
    }
  };

  const handleDownload = async () => {
    if (!analysisResults) return;

    try {
      // Find the results container element
      const resultsElement = document.getElementById('analysis-results');
      if (!resultsElement) {
        toast({
          title: "저장 실패",
          description: "결과 영역을 찾을 수 없습니다.",
          variant: "destructive",
        });
        return;
      }

      // Capture the results as canvas with improved settings
      const canvas = await html2canvas(resultsElement, {
        backgroundColor: '#ffffff',
        scale: 3, // Much higher quality
        useCORS: true,
        allowTaint: true,
        height: resultsElement.scrollHeight,
        width: resultsElement.scrollWidth,
        scrollX: 0,
        scrollY: 0,
        imageTimeout: 15000,
        removeContainer: true,
        logging: false,
        ignoreElements: (element) => {
          // Skip empty elements that might cause spacing issues
          return element.classList.contains('empty-space') || 
                 (element.tagName === 'DIV' && element.innerHTML.trim() === '');
        }
      });

      // Convert canvas to blob with high quality
      canvas.toBlob((blob) => {
        if (!blob) {
          toast({
            title: "저장 실패",
            description: "이미지 생성에 실패했습니다.",
            variant: "destructive",
          });
          return;
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `관상분석결과_${new Date().toISOString().split('T')[0]}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "결과 저장됨",
          description: "분석 결과가 이미지 파일로 저장되었습니다.",
        });
      }, 'image/png', 1.0);

    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast({
        title: "저장 실패",
        description: "이미지 저장 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const steps = [
    { id: 1, name: "이미지 업로드", icon: Camera },
    { id: 2, name: "AI 분석", icon: Brain },
    { id: 3, name: "결과 확인", icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-korean-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-korean-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-korean-brown rounded-lg flex items-center justify-center">
                <User className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold korean-brown">AI 관상</h1>
                <p className="text-xs text-gray-500">Face Reading AI</p>
              </div>
            </div>
            
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-korean-cream to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold korean-brown mb-6 leading-tight">
              AI와 전통 관상학의<br />특별한 만남
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              최신 인공지능 기술로 당신의 얼굴을 분석하고<br />
              천년의 지혜가 담긴 전통 관상학으로 해석해드립니다
            </p>
            
          </div>
        </div>
      </section>

      

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      isActive ? 'bg-korean-brown text-white' : 
                      isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                    }`}>
                      {isCompleted ? '✓' : step.id}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      isActive ? 'korean-brown' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-12 h-px bg-gray-300 mx-4"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Image Upload */}
        {currentStep === 1 && (
          <div id="upload-section" className="animate-fade-in">
            <Card className="rounded-2xl shadow-lg p-8 mb-8">
              <CardContent className="p-0">
                <h2 className="text-2xl font-bold korean-brown mb-6 text-center">
                  얼굴 사진을 업로드해 주세요
                </h2>
                
                {/* Gender Selection */}
                <div className="mb-8">
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    더 정확한 분석을 위해 성별을 선택해주세요 (선택사항)
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant={selectedGender === 'male' ? 'default' : 'outline'}
                      onClick={() => setSelectedGender('male')}
                      className={selectedGender === 'male' ? 'bg-korean-brown' : 'border-korean-brown korean-brown hover:bg-korean-brown hover:text-white'}
                    >
                      <User className="w-4 h-4 mr-2" />
                      남성
                    </Button>
                    <Button
                      variant={selectedGender === 'female' ? 'default' : 'outline'}
                      onClick={() => setSelectedGender('female')}
                      className={selectedGender === 'female' ? 'bg-korean-brown' : 'border-korean-brown korean-brown hover:bg-korean-brown hover:text-white'}
                    >
                      <User className="w-4 h-4 mr-2" />
                      여성
                    </Button>
                  </div>
                </div>

                {/* Upload Area */}
                <UploadArea 
                  onImageUpload={handleImageUpload}
                  imagePreview={imagePreview}
                  onRemoveImage={() => {
                    setUploadedImage(null);
                    setImagePreview(null);
                  }}
                />

                {/* Analyze Button */}
                {uploadedImage && (
                  <div className="mt-6">
                    <Button 
                      onClick={handleAnalysis}
                      className="w-full bg-korean-brown hover:bg-korean-brown/90 text-white py-3 rounded-xl font-medium"
                    >
                      <Brain className="w-4 h-4 mr-2" />
                      AI 분석 시작하기
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Analysis Loading */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <Card className="rounded-2xl shadow-lg p-8 mb-8 text-center">
              <CardContent className="p-0">
                <div className="animate-spin w-16 h-16 border-4 border-korean-cream border-t-korean-brown rounded-full mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold korean-brown mb-4">
                  AI가 당신의 얼굴을 분석중입니다
                </h2>
                <p className="text-gray-600 mb-6">
                  얼굴 랜드마크 추출 및 관상학적 특징을 분석하고 있습니다...
                </p>
                <div className="bg-korean-cream rounded-lg p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>얼굴 인식</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-700">완료</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>이목구비 분석</span>
                      <Badge variant="secondary" className="bg-korean-bronze text-white">
                        {isAnalyzing ? '진행중...' : '완료'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>관상학적 해석</span>
                      <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                        {isAnalyzing ? '대기중' : '완료'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Analysis Results */}
        {currentStep === 3 && analysisResults && (
          <div className="animate-fade-in">
            <div id="analysis-results" className="mb-6">
              <AnalysisResults 
                results={analysisResults}
                imagePreview={imagePreview}
              />
            </div>
            
            {/* Action Buttons - Outside of capture area */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button
                variant="outline"
                onClick={handleShare}
                className="korean-brown border-korean-brown hover:bg-korean-brown hover:text-white px-8 py-3 rounded-xl font-medium"
              >
                <Share className="w-4 h-4 mr-2" />
                결과 공유하기
              </Button>
              <Button
                onClick={handleDownload}
                className="bg-korean-bronze hover:bg-korean-bronze/90 text-white px-8 py-3 rounded-xl font-medium"
              >
                <Download className="w-4 h-4 mr-2" />
                이미지로 저장하기
              </Button>
              <Button
                onClick={handleNewAnalysis}
                className="bg-korean-brown hover:bg-korean-brown/90 text-white px-8 py-3 rounded-xl font-medium"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                새로운 분석하기
              </Button>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-800 mb-2">분석 오류</h3>
                <p className="text-red-600">{error}</p>
                <Button 
                  onClick={handleNewAnalysis}
                  variant="outline"
                  className="mt-4"
                >
                  다시 시도하기
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Disclaimer Section */}
      <section className="bg-korean-cream py-8 mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              ※ 본 서비스의 결과는 참고용이며, 개인의 운명이나 성격을 완전히 결정하지 않습니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>• 전통 관상학 기반 분석</span>
              <span>• AI 딥러닝 기술 적용</span>
              <span>• 개인정보 보호 보장</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-korean-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-korean-brown rounded-lg flex items-center justify-center">
                <User className="text-white text-sm" />
              </div>
              <div>
                <h2 className="text-lg font-bold korean-bronze">AI 관상</h2>
                <p className="text-xs text-gray-400">Face Reading AI</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              &copy; 2024 AI 관상. All rights reserved. Made with ❤️ in Korea
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
