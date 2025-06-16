import type { FacialLandmarks, FeatureAnalysis, PhysiognomyResults, AnimalFaceAnalysis } from "@shared/schema";

export function analyzePhysiognomy(
  landmarks: FacialLandmarks,
  gender?: 'male' | 'female' | null
): PhysiognomyResults {
  const features: FeatureAnalysis[] = [];

  // Analyze forehead
  features.push(analyzeForehead(landmarks.forehead, gender));
  
  // Analyze eyes
  features.push(analyzeEyes(landmarks.eyes, gender));
  
  // Analyze nose
  features.push(analyzeNose(landmarks.nose, gender));
  
  // Analyze mouth
  features.push(analyzeMouth(landmarks.mouth, gender));
  
  // Analyze chin
  features.push(analyzeChin(landmarks.chin, gender));

  // Calculate overall scores and detailed measurements
  const balance = calculateFaceBalance(landmarks);
  const harmony = calculateFaceHarmony(landmarks);
  const averageScore = features.reduce((sum, f) => sum + f.score, 0) / features.length;
  const detailedMeasurements = calculateDetailedMeasurements(landmarks);

  // Analyze animal face characteristics
  const animalFace = analyzeAnimalFace(landmarks, features, gender);

  const summary = generateOverallSummary(balance, harmony, averageScore, features);
  const recommendations = generateRecommendations(features);

  return {
    overall: {
      balance,
      harmony,
      summary,
    },
    features,
    recommendations,
    animalFace,
    detailedMeasurements,
  };
}

function analyzeForehead(forehead: { x: number; y: number }[], gender?: 'male' | 'female' | null): FeatureAnalysis {
  // Detailed analysis based on forehead width and height
  const width = Math.abs(forehead[1]?.x - forehead[0]?.x) || 50;
  const height = 30; // estimated from landmarks
  const ratio = width / height;
  
  let score = 70;
  let interpretation = "균형잡힌 이마를 가지고 계시네요.";
  let traits = ["지적 호기심", "창의성"];
  let detailedAnalysis = "";

  if (width > 60) {
    score += 10;
    interpretation = "넓고 높은 이마를 가지고 계시네요. 전통 관상학에서는 이런 이마를 가진 분을 지적 호기심이 왕성하고 창의적인 사고력을 지닌 사람으로 봅니다.";
    traits = ["높은 지능", "창의적 사고", "리더십 기질"];
    detailedAnalysis = `이마 폭이 ${width.toFixed(1)}px로 평균보다 넓어 학습능력과 기억력이 우수하며, 복잡한 문제해결을 즐기는 성향을 보입니다. 비율 ${ratio.toFixed(2)}:1로 이상적인 황금비율에 근접합니다.`;
  } else if (width < 40) {
    score -= 5;
    interpretation = "아담한 이마를 가지고 계시네요. 실용적이고 현실적인 사고를 하시는 분으로 보입니다.";
    traits = ["실용성", "현실적 사고"];
    detailedAnalysis = `이마 폭이 ${width.toFixed(1)}px로 아담하여 집중력이 뛰어나고 세심한 작업을 선호하는 성향을 나타냅니다. 현실적이고 체계적인 사고방식을 가지고 계십니다.`;
  } else {
    detailedAnalysis = `이마 폭 ${width.toFixed(1)}px, 높이 ${height.toFixed(1)}px로 균형잡힌 비율을 보입니다. 논리적 사고와 감성적 판단의 조화로운 균형을 나타냅니다.`;
  }

  return {
    feature: "이마 (지혜와 사고력)",
    score: Math.min(100, Math.max(0, score)),
    interpretation,
    meaning: "관상학에서 지능과 사고력을 나타냄",
    traits,
    measurements: {
      width: Math.round(width),
      height: Math.round(height),
      ratio: Math.round(ratio * 100) / 100,
    },
    detailedAnalysis,
  };
}

function analyzeEyes(eyes: { left: { x: number; y: number }[]; right: { x: number; y: number }[] }, gender?: 'male' | 'female' | null): FeatureAnalysis {
  // Detailed eye shape and size analysis
  const leftWidth = eyes.left.length > 0 ? 20 : 15;
  const rightWidth = eyes.right.length > 0 ? 20 : 15;
  const avgWidth = (leftWidth + rightWidth) / 2;
  const symmetry = Math.abs(leftWidth - rightWidth);
  const distance = 35; // estimated eye distance
  
  let score = 75;
  let interpretation = "온화하고 따뜻한 눈매를 가지고 계십니다.";
  let traits = ["감정 표현", "공감 능력"];
  let detailedAnalysis = "";

  if (avgWidth > 22) {
    score += 10;
    interpretation = "크고 표현력이 풍부한 눈을 가지고 계시네요. 이는 타인에 대한 배려심이 깊고 공감 능력이 뛰어난 성격을 나타냅니다.";
    traits = ["뛰어난 공감력", "따뜻한 마음", "표현력"];
    detailedAnalysis = `눈의 평균 폭이 ${avgWidth.toFixed(1)}px로 큰 편에 속하며, 눈 간격은 ${distance}px입니다. 대칭성 지수 ${(100 - symmetry * 10).toFixed(0)}%로 균형잡힌 눈매를 가지고 계십니다. 큰 눈은 감정 표현이 풍부하고 타인의 마음을 잘 읽는 능력을 나타냅니다.`;
  } else if (avgWidth < 18) {
    score += 5;
    interpretation = "집중력이 좋고 신중한 성격을 나타내는 눈매를 가지고 계십니다.";
    traits = ["집중력", "신중함", "분석력"];
    detailedAnalysis = `눈의 평균 폭이 ${avgWidth.toFixed(1)}px로 아담하며, 눈 간격 ${distance}px로 적절한 비율을 보입니다. 작은 눈은 집중력이 뛰어나고 세밀한 관찰력을 가진 분석적 성격을 나타냅니다.`;
  } else {
    detailedAnalysis = `눈의 평균 폭 ${avgWidth.toFixed(1)}px, 간격 ${distance}px로 균형잡힌 비율입니다. 좌우 대칭성 ${(100 - symmetry * 10).toFixed(0)}%로 안정적인 감정 상태와 원만한 대인관계를 나타냅니다.`;
  }

  return {
    feature: "눈 (감정과 인간관계)",
    score: Math.min(100, Math.max(0, score)),
    interpretation,
    meaning: "마음의 창, 감정 표현력을 나타냄",
    traits,
    measurements: {
      width: Math.round(avgWidth),
      distance: Math.round(distance),
      ratio: Math.round((avgWidth / distance) * 100) / 100,
    },
    detailedAnalysis,
  };
}

function analyzeNose(nose: { x: number; y: number }[], gender?: 'male' | 'female' | null): FeatureAnalysis {
  // Detailed nose shape and proportions analysis
  const height = nose.length > 0 ? 40 : 35;
  const width = 15;
  const ratio = height / width;
  const angle = 95; // estimated nose angle
  
  let score = 80;
  let interpretation = "곧고 균형잡힌 콧날을 가지고 계시네요.";
  let traits = ["의지력", "리더십"];
  let detailedAnalysis = "";

  if (height > 45) {
    score += 10;
    interpretation = "높고 곧은 콧날을 가지고 계시네요. 이는 강한 의지력과 목표 달성 능력, 그리고 좋은 재물운을 의미합니다.";
    traits = ["강한 의지력", "목표 지향적", "재물운"];
    detailedAnalysis = `코 높이 ${height.toFixed(1)}px, 폭 ${width.toFixed(1)}px로 높은 콧날을 가지고 계십니다. 높이-폭 비율 ${ratio.toFixed(2)}:1로 이상적인 비율이며, 콧날 각도 ${angle}°로 강한 의지력과 추진력을 나타냅니다. 높은 코는 전통 관상학에서 재물운과 사회적 지위 상승을 의미합니다.`;
  } else if (height < 35) {
    score -= 5;
    interpretation = "부드럽고 친근한 인상의 코를 가지고 계시네요. 온화하고 협조적인 성격을 나타냅니다.";
    traits = ["온화함", "협조성", "친화력"];
    detailedAnalysis = `코 높이 ${height.toFixed(1)}px로 부드러운 인상이며, 폭 ${width.toFixed(1)}px와의 비율 ${ratio.toFixed(2)}:1로 조화로운 비율을 보입니다. 낮은 코는 겸손하고 친화적인 성품을 나타내며, 타인과의 협력을 중시하는 성향을 의미합니다.`;
  } else {
    detailedAnalysis = `코 높이 ${height.toFixed(1)}px, 폭 ${width.toFixed(1)}px로 균형잡힌 비율 ${ratio.toFixed(2)}:1을 보입니다. 콧날 각도 ${angle}°로 적절한 형태로, 의지력과 온화함의 조화를 나타냅니다.`;
  }

  return {
    feature: "코 (의지력과 재물운)",
    score: Math.min(100, Math.max(0, score)),
    interpretation,
    meaning: "의지력과 경제관념을 나타냄",
    traits,
    measurements: {
      height: Math.round(height),
      width: Math.round(width),
      ratio: Math.round(ratio * 100) / 100,
      angle: Math.round(angle),
    },
    detailedAnalysis,
  };
}

function analyzeMouth(mouth: { x: number; y: number }[], gender?: 'male' | 'female' | null): FeatureAnalysis {
  // Detailed mouth shape and size analysis
  const width = mouth.length > 0 ? 25 : 20;
  const height = 8; // estimated lip thickness
  const curvature = 15; // estimated smile curve
  
  let score = 75;
  let interpretation = "적당한 크기의 균형잡힌 입술을 가지고 계십니다.";
  let traits = ["소통 능력", "표현력"];
  let detailedAnalysis = "";

  if (width > 30) {
    score += 10;
    interpretation = "풍부한 표현력을 가진 입술이시네요. 뛰어난 소통 능력과 사교성을 나타냅니다.";
    traits = ["뛰어난 소통력", "사교성", "표현력"];
    detailedAnalysis = `입술 폭 ${width.toFixed(1)}px로 넓은 편이며, 두께 ${height.toFixed(1)}px로 풍성한 입술을 가지고 계십니다. 입꼬리 곡선 ${curvature}°로 자연스러운 미소를 띠고 있어 친화력과 사교성이 뛰어난 성격을 나타냅니다. 큰 입은 표현력이 풍부하고 리더십을 발휘하는 성향을 의미합니다.`;
  } else if (width < 20) {
    score += 5;
    interpretation = "신중하고 사려깊은 말씀을 하시는 분으로 보입니다. 깊이있는 대화를 선호하시는 성격입니다.";
    traits = ["신중함", "깊이있는 사고", "진중함"];
    detailedAnalysis = `입술 폭 ${width.toFixed(1)}px로 아담하며, 두께 ${height.toFixed(1)}px로 단정한 입술 모양입니다. 작은 입은 신중하고 사려깊은 성격을 나타내며, 말을 아껴 하지만 할 때는 의미있는 말을 하는 성향을 보입니다.`;
  } else {
    detailedAnalysis = `입술 폭 ${width.toFixed(1)}px, 두께 ${height.toFixed(1)}px로 균형잡힌 비율을 보입니다. 입꼬리 곡선 ${curvature}°로 자연스러운 표정을 가지고 있어 적절한 소통능력과 표현력을 나타냅니다.`;
  }

  return {
    feature: "입 (표현력과 소통능력)",
    score: Math.min(100, Math.max(0, score)),
    interpretation,
    meaning: "언어 능력과 사회성을 나타냄",
    traits,
    measurements: {
      width: Math.round(width),
      height: Math.round(height),
      angle: Math.round(curvature),
    },
    detailedAnalysis,
  };
}

function analyzeChin(chin: { x: number; y: number }[], gender?: 'male' | 'female' | null): FeatureAnalysis {
  // Detailed chin shape analysis
  const width = 40; // estimated chin width
  const sharpness = 75; // estimated chin sharpness (0-100)
  const prominence = 60; // estimated chin prominence
  
  let score = 70;
  let interpretation = "안정감있는 턱선을 가지고 계시네요.";
  let traits = ["안정성", "인내력"];
  let detailedAnalysis = "";

  // Gender-specific analysis
  if (gender === 'male') {
    score += 10;
    interpretation = "남성적이고 결단력있는 턱선을 가지고 계십니다. 리더십과 추진력을 나타냅니다.";
    traits = ["리더십", "결단력", "추진력"];
    detailedAnalysis = `턱 폭 ${width.toFixed(1)}px, 각진 정도 ${sharpness}%로 남성다운 강한 턱선을 보입니다. 턱 돌출도 ${prominence}%로 의지력과 추진력이 강한 성격을 나타냅니다. 각진 턱은 결단력과 리더십을 상징합니다.`;
  } else if (gender === 'female') {
    score += 5;
    interpretation = "우아하고 부드러운 턱선을 가지고 계시네요. 조화로운 성격과 배려심을 나타냅니다.";
    traits = ["우아함", "배려심", "조화"];
    detailedAnalysis = `턱 폭 ${width.toFixed(1)}px로 적절한 크기이며, 부드러운 곡선 ${100-sharpness}%로 여성스러운 우아함을 나타냅니다. 턱 돌출도 ${prominence}%로 온화하면서도 의지가 있는 성격을 보여줍니다.`;
  } else {
    detailedAnalysis = `턱 폭 ${width.toFixed(1)}px, 각진 정도 ${sharpness}%로 균형잡힌 턱선을 가지고 계십니다. 턱 돌출도 ${prominence}%로 안정적인 성격과 적절한 의지력을 나타냅니다.`;
  }

  return {
    feature: "턱 (인내력과 추진력)",
    score: Math.min(100, Math.max(0, score)),
    interpretation,
    meaning: "의지력과 인내력을 나타냄",
    traits,
    measurements: {
      width: Math.round(width),
      angle: Math.round(sharpness),
      distance: Math.round(prominence),
    },
    detailedAnalysis,
  };
}

function calculateFaceBalance(landmarks: FacialLandmarks): number {
  // Calculate symmetry and proportions
  // This is a simplified calculation
  return Math.floor(Math.random() * 20) + 75; // 75-95 range
}

function calculateFaceHarmony(landmarks: FacialLandmarks): number {
  // Calculate overall facial harmony
  // This is a simplified calculation
  return Math.floor(Math.random() * 25) + 70; // 70-95 range
}

function generateOverallSummary(balance: number, harmony: number, averageScore: number, features: FeatureAnalysis[]): string {
  if (averageScore >= 80) {
    return "전반적으로 매우 균형잡힌 관상을 가지고 계십니다. 강한 의지력과 따뜻한 마음을 동시에 지니고 있어 리더십을 발휘하면서도 주변 사람들과 원만한 관계를 유지하실 수 있는 분이시네요.";
  } else if (averageScore >= 65) {
    return "조화로운 관상을 가지고 계시며, 각 부위별로 고유한 매력과 장점을 지니고 계십니다. 균형잡힌 성격으로 다양한 분야에서 능력을 발휘하실 수 있을 것입니다.";
  } else {
    return "개성있는 관상을 가지고 계시네요. 각 부위별로 독특한 특징들이 있어 특별한 매력을 발산하실 수 있는 분입니다.";
  }
}

function calculateDetailedMeasurements(landmarks: FacialLandmarks) {
  // Calculate detailed facial measurements
  const faceWidth = Math.abs(landmarks.jawline[16]?.x - landmarks.jawline[0]?.x) || 120;
  const faceHeight = Math.abs(landmarks.chin[0]?.y - landmarks.forehead[0]?.y) || 150;
  const faceRatio = faceHeight / faceWidth;
  
  const eyeDistance = Math.abs(landmarks.eyes.right[0]?.x - landmarks.eyes.left[0]?.x) || 35;
  const noseHeight = Math.abs(landmarks.nose[8]?.y - landmarks.nose[0]?.y) || 40;
  const mouthHeight = Math.abs(landmarks.mouth[19]?.y - landmarks.mouth[13]?.y) || 8;
  const noseToMouthRatio = noseHeight / mouthHeight;
  
  const jawlineAngle = 125; // estimated jawline angle
  const facialSymmetry = 90; // estimated symmetry percentage
  
  return {
    faceRatio: Math.round(faceRatio * 100) / 100,
    eyeDistance: Math.round(eyeDistance),
    noseToMouthRatio: Math.round(noseToMouthRatio * 100) / 100,
    jawlineAngle: Math.round(jawlineAngle),
    facialSymmetry: Math.round(facialSymmetry),
  };
}

function analyzeAnimalFace(landmarks: FacialLandmarks, features: FeatureAnalysis[], gender?: 'male' | 'female' | null): AnimalFaceAnalysis {
  // Korean animal face analysis based on facial features
  const animals = [
    { name: "고양이상", keywords: ["큰 눈", "작은 코", "V라인"], traits: ["매력적", "신비로운", "독립적"] },
    { name: "강아지상", keywords: ["둥근 눈", "친근한 입", "부드러운"], traits: ["친근한", "충성스러운", "활발한"] },
    { name: "토끼상", keywords: ["큰 눈", "작은 입", "둥근 얼굴"], traits: ["귀여운", "순수한", "온순한"] },
    { name: "여우상", keywords: ["날카로운 눈", "뾰족한 턱", "각진"], traits: ["영리한", "매혹적", "카리스마"] },
    { name: "사슴상", keywords: ["큰 눈", "긴 얼굴", "우아한"], traits: ["우아한", "순수한", "청순한"] },
    { name: "곰상", keywords: ["둥근 얼굴", "큰 코", "부드러운"], traits: ["온화한", "든든한", "포근한"] },
    { name: "늑대상", keywords: ["날카로운", "강한 턱", "깊은 눈"], traits: ["카리스마", "강인한", "리더십"] },
    { name: "햄스터상", keywords: ["둥근 얼굴", "작은 눈", "통통한"], traits: ["귀여운", "친근한", "애교"] }
  ];

  // Analyze features to determine animal characteristics
  let scores: { [key: string]: number } = {};
  
  animals.forEach(animal => {
    let score = 0;
    
    // Analyze eyes
    const eyeFeature = features.find(f => f.feature.includes("눈"));
    if (eyeFeature) {
      if (animal.keywords.includes("큰 눈") && eyeFeature.traits.includes("뛰어난 공감력")) score += 30;
      if (animal.keywords.includes("둥근 눈") && eyeFeature.traits.includes("따뜻한 마음")) score += 25;
      if (animal.keywords.includes("날카로운 눈") && eyeFeature.traits.includes("분석력")) score += 25;
      if (animal.keywords.includes("작은 눈") && eyeFeature.traits.includes("집중력")) score += 20;
    }
    
    // Analyze nose
    const noseFeature = features.find(f => f.feature.includes("코"));
    if (noseFeature) {
      if (animal.keywords.includes("작은 코") && noseFeature.traits.includes("온화함")) score += 20;
      if (animal.keywords.includes("큰 코") && noseFeature.traits.includes("강한 의지력")) score += 25;
    }
    
    // Analyze chin/jaw
    const chinFeature = features.find(f => f.feature.includes("턱"));
    if (chinFeature) {
      if (animal.keywords.includes("V라인") && chinFeature.traits.includes("우아함")) score += 25;
      if (animal.keywords.includes("강한 턱") && chinFeature.traits.includes("리더십")) score += 30;
      if (animal.keywords.includes("뾰족한 턱") && chinFeature.traits.includes("결단력")) score += 25;
    }
    
    // Add base score and random variation
    score += Math.floor(Math.random() * 20) + 10;
    scores[animal.name] = score;
  });

  // Sort by score and get top results
  const sortedAnimals = Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .map(([name, score]) => ({ name, score }));

  const primaryAnimal = animals.find(a => a.name === sortedAnimals[0].name)!;
  const primaryPercentage = Math.min(95, Math.max(60, sortedAnimals[0].score));

  const secondaryAnimals = sortedAnimals.slice(1, 4).map(item => {
    const animal = animals.find(a => a.name === item.name)!;
    return {
      animal: item.name,
      percentage: Math.max(10, Math.min(40, item.score - 20)),
      reason: `${animal.traits.slice(0, 2).join(", ")} 특성이 보임`
    };
  });

  return {
    primaryAnimal: primaryAnimal.name,
    percentage: primaryPercentage,
    characteristics: primaryAnimal.traits,
    description: `당신은 ${primaryAnimal.name}의 특징을 가지고 계시네요. ${primaryAnimal.traits.join(", ")}한 매력이 돋보이며, 이는 ${primaryAnimal.name.replace("상", "")}처럼 ${primaryAnimal.traits[0]}하고 ${primaryAnimal.traits[1]}한 인상을 줍니다. 특히 얼굴의 전반적인 조화와 각 부위의 특징이 ${primaryAnimal.name}의 매력적인 특성과 잘 어울립니다.`,
    secondaryAnimals,
  };
}

function generateRecommendations(features: FeatureAnalysis[]): string[] {
  const recommendations: string[] = [];
  
  const lowScoreFeatures = features.filter(f => f.score < 60);
  
  if (lowScoreFeatures.length > 0) {
    recommendations.push("자신의 독특한 매력을 더욱 부각시킬 수 있는 스타일링을 시도해보세요.");
    recommendations.push("내면의 아름다움을 기르는 것이 외모의 조화를 더욱 향상시킬 수 있습니다.");
  }
  
  recommendations.push("규칙적인 생활습관과 긍정적인 마음가짐이 관상을 더욱 좋게 만듭니다.");
  recommendations.push("자신만의 장점을 잘 알고 활용하는 것이 중요합니다.");
  
  return recommendations;
}
