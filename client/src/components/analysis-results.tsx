import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaceOverlay } from "./face-overlay";
import { Brain, Eye, Mountain, MessageCircle, Heart, Ruler, BarChart3, Sparkles } from "lucide-react";
import type { PhysiognomyResults } from "@shared/schema";

interface AnalysisResultsProps {
  results: PhysiognomyResults;
  imagePreview?: string | null;
}

export function AnalysisResults({ results, imagePreview }: AnalysisResultsProps) {
  const getFeatureIcon = (feature: string) => {
    switch (feature.toLowerCase()) {
      case 'forehead':
      case '이마':
        return Brain;
      case 'eyes':
      case '눈':
        return Eye;
      case 'nose':
      case '코':
        return Mountain;
      case 'mouth':
      case '입':
        return MessageCircle;
      default:
        return Heart;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-korean-bronze';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '매우 높음';
    if (score >= 60) return '높음';
    if (score >= 40) return '보통';
    return '낮음';
  };

  return (
    <div className="space-y-6 no-bottom-space">
      {/* Results Header */}
      <Card className="rounded-2xl shadow-lg p-8">
        <CardContent className="p-0">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold korean-brown mb-4">관상 분석 결과</h2>
            <p className="text-gray-600">
              AI가 분석한 당신의 얼굴 특징과 전통 관상학적 해석입니다
            </p>
          </div>

          {/* Face Analysis Visualization */}
          <div className="bg-gradient-to-br from-korean-cream to-white rounded-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative">
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview}
                      alt="Face analysis with landmarks" 
                      className="w-64 h-80 object-cover rounded-lg shadow-md"
                      style={{ 
                        imageRendering: '-webkit-optimize-contrast',
                        filter: 'contrast(1.1) brightness(1.05) sharpen(1px)',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                      }}
                      loading="eager"
                    />
                    <FaceOverlay />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold korean-brown mb-4">전체적인 인상</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm">균형 지수: {results.overall.balance}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-korean-bronze rounded-full mr-3"></div>
                    <span className="text-sm">조화 지수: {results.overall.harmony}%</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-sm">{results.overall.summary}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animal Face Analysis */}
      <Card className="rounded-2xl shadow-lg p-8 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-0">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-purple-600 mr-3" />
              <h3 className="text-2xl font-bold korean-brown">동물상 분석</h3>
            </div>
            <p className="text-gray-600">당신의 얼굴에서 발견되는 동물의 특징</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="text-4xl mb-4">{results.animalFace.primaryAnimal.includes('고양이') ? '🐱' : 
                                                results.animalFace.primaryAnimal.includes('강아지') ? '🐶' :
                                                results.animalFace.primaryAnimal.includes('토끼') ? '🐰' :
                                                results.animalFace.primaryAnimal.includes('여우') ? '🦊' :
                                                results.animalFace.primaryAnimal.includes('사슴') ? '🦌' :
                                                results.animalFace.primaryAnimal.includes('곰') ? '🐻' :
                                                results.animalFace.primaryAnimal.includes('늑대') ? '🐺' : '🐹'}</div>
              <h4 className="text-xl font-bold korean-brown mb-2">{results.animalFace.primaryAnimal}</h4>
              <div className="flex items-center justify-center mb-4">
                <Progress value={results.animalFace.percentage} className="w-32 h-3 mr-3" />
                <span className="font-semibold text-purple-600">{results.animalFace.percentage}%</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {results.animalFace.characteristics.map((trait, index) => (
                  <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                    {trait}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed">{results.animalFace.description}</p>
            </div>
          </div>

          {/* Secondary Animal Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.animalFace.secondaryAnimals.map((animal, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center">
                <h5 className="font-semibold korean-brown mb-2">{animal.animal}</h5>
                <div className="flex items-center justify-center mb-2">
                  <Progress value={animal.percentage} className="w-20 h-2 mr-2" />
                  <span className="text-sm text-gray-600">{animal.percentage}%</span>
                </div>
                <p className="text-xs text-gray-500">{animal.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis with Tabs */}
      <Card className="rounded-2xl shadow-lg p-8">
        <CardContent className="p-0">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="features" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                부위별 분석
              </TabsTrigger>
              <TabsTrigger value="measurements" className="flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                정밀 측정
              </TabsTrigger>
              <TabsTrigger value="detailed" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                상세 분석
              </TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {results.features.map((feature, index) => {
                  const Icon = getFeatureIcon(feature.feature);
                  
                  return (
                    <Card key={index} className="rounded-xl shadow-lg p-6 animate-slide-up">
                      <CardContent className="p-0">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-korean-cream rounded-lg flex items-center justify-center mr-4">
                            <Icon className="korean-brown text-xl w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold korean-charcoal">{feature.feature}</h3>
                            <p className="text-sm text-gray-500">{feature.meaning}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="bg-korean-cream rounded-lg p-4">
                            <h4 className="font-medium korean-brown mb-2">분석 결과</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {feature.interpretation}
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">특성 점수</span>
                            <div className="flex items-center gap-2">
                              <Progress value={feature.score} className="w-24 h-2" />
                              <span className="font-medium">{getScoreLabel(feature.score)}</span>
                            </div>
                          </div>
                          
                          {feature.traits.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {feature.traits.map((trait, traitIndex) => (
                                <Badge 
                                  key={traitIndex} 
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="measurements" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Overall Face Measurements */}
                <Card className="p-6">
                  <CardContent className="p-0">
                    <h3 className="font-bold korean-brown mb-4 flex items-center">
                      <Ruler className="w-5 h-5 mr-2" />
                      전체 얼굴 비율
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">얼굴 비율</span>
                        <span className="font-medium">{results.detailedMeasurements.faceRatio}:1</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">눈 간격</span>
                        <span className="font-medium">{results.detailedMeasurements.eyeDistance}px</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">턱선 각도</span>
                        <span className="font-medium">{results.detailedMeasurements.jawlineAngle}°</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">얼굴 대칭성</span>
                        <span className="font-medium">{results.detailedMeasurements.facialSymmetry}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Individual Feature Measurements */}
                {results.features.filter(feature => 
                  feature.measurements && 
                  (feature.measurements.width || feature.measurements.height || 
                   feature.measurements.ratio || feature.measurements.angle || 
                   feature.measurements.distance)
                ).map((feature, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="p-0">
                      <h3 className="font-bold korean-brown mb-4">{feature.feature} 측정값</h3>
                      <div className="space-y-2">
                        {feature.measurements.width && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">폭</span>
                            <span className="font-medium">{feature.measurements.width}px</span>
                          </div>
                        )}
                        {feature.measurements.height && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">높이</span>
                            <span className="font-medium">{feature.measurements.height}px</span>
                          </div>
                        )}
                        {feature.measurements.ratio && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">비율</span>
                            <span className="font-medium">{feature.measurements.ratio}:1</span>
                          </div>
                        )}
                        {feature.measurements.angle && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">각도</span>
                            <span className="font-medium">{feature.measurements.angle}°</span>
                          </div>
                        )}
                        {feature.measurements.distance && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">거리</span>
                            <span className="font-medium">{feature.measurements.distance}px</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="detailed" className="space-y-6">
              {results.features.map((feature, index) => (
                <Card key={index} className="p-6">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-korean-cream rounded-lg flex items-center justify-center mr-3">
                        {React.createElement(getFeatureIcon(feature.feature), { className: "korean-brown w-5 h-5" })}
                      </div>
                      <h3 className="font-bold korean-brown text-lg">{feature.feature}</h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold korean-brown mb-2">정밀 분석 보고서</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{feature.detailedAnalysis}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Overall Summary */}
      <Card className="rounded-2xl shadow-lg border border-gray-200">
        <CardContent className="p-8">
          <div className="bg-gradient-to-r from-korean-brown to-korean-bronze rounded-xl p-6 text-white mb-6">
            <h3 className="text-2xl font-bold mb-6 text-center">종합 관상 해석</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">{results.overall.balance}%</div>
                <div className="text-sm opacity-90">전체적 균형</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">{results.overall.harmony}%</div>
                <div className="text-sm opacity-90">조화로움</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">
                  {results.features.reduce((avg, f) => avg + f.score, 0) / results.features.length | 0}%
                </div>
                <div className="text-sm opacity-90">평균 점수</div>
              </div>
            </div>
          </div>
          
          <div className="bg-korean-cream rounded-lg p-6">
            <p className="text-center leading-relaxed text-gray-800 korean-brown text-lg font-medium mb-4">
              {results.overall.summary}
            </p>
            {results.recommendations.length > 0 && (
              <div className="border-t border-gray-300 pt-4">
                <h4 className="font-semibold mb-3 korean-brown text-lg">개선 추천사항:</h4>
                <ul className="space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="korean-bronze mr-3 font-bold">•</span>
                      <span className="text-gray-700 leading-relaxed">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
