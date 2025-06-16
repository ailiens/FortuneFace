import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { initializeFaceAPI, analyzeFaceImage, extractFacialFeatures } from "@/lib/face-analysis";
import { analyzePhysiognomy } from "@/lib/physiognomy-rules";
import type { PhysiognomyResults } from "@shared/schema";

export function useFaceAnalysis() {
  const [analysisResults, setAnalysisResults] = useState<PhysiognomyResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analysisMutation = useMutation({
    mutationFn: async ({ image, gender }: { image: File; gender?: 'male' | 'female' | null }) => {
      // Initialize face API if not already done
      await initializeFaceAPI();

      // Create image element for analysis
      const imageElement = new Image();
      const imageUrl = URL.createObjectURL(image);
      
      return new Promise<PhysiognomyResults>((resolve, reject) => {
        imageElement.onload = async () => {
          try {
            // Analyze face with face-api.js
            const faceAnalysis = await analyzeFaceImage(imageElement);
            
            // Extract facial features
            const facialLandmarks = extractFacialFeatures(faceAnalysis.landmarks);
            
            // Apply physiognomy rules
            const physiognomyResults = analyzePhysiognomy(facialLandmarks, gender);
            
            // Save analysis to backend
            try {
              await apiRequest('POST', '/api/save-analysis', {
                imageUrl: imageUrl,
                gender: gender || null,
                facialLandmarks,
                analysisResults: physiognomyResults,
              });
            } catch (saveError) {
              console.warn('Failed to save analysis results:', saveError);
              // Continue even if saving fails
            }
            
            // Clean up
            URL.revokeObjectURL(imageUrl);
            
            resolve(physiognomyResults);
          } catch (error) {
            URL.revokeObjectURL(imageUrl);
            reject(error);
          }
        };
        
        imageElement.onerror = () => {
          URL.revokeObjectURL(imageUrl);
          reject(new Error('이미지를 로드할 수 없습니다.'));
        };
        
        imageElement.src = imageUrl;
      });
    },
    onSuccess: (results) => {
      setAnalysisResults(results);
      setError(null);
    },
    onError: (error) => {
      console.error('Face analysis failed:', error);
      setError(error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.');
      setAnalysisResults(null);
    },
  });

  const analyzeImage = async (image: File, gender?: 'male' | 'female' | null) => {
    return analysisMutation.mutateAsync({ image, gender });
  };

  return {
    analyzeImage,
    analysisResults,
    isAnalyzing: analysisMutation.isPending,
    error,
    reset: () => {
      setAnalysisResults(null);
      setError(null);
    },
  };
}
