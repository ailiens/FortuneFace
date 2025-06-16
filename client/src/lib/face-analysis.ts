import * as faceapi from 'face-api.js';

let isInitialized = false;

export async function initializeFaceAPI() {
  if (isInitialized) return;

  try {
    // Load models from CDN
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);

    isInitialized = true;
    console.log('Face-api.js models loaded successfully');
  } catch (error) {
    console.error('Failed to load face-api.js models:', error);
    throw new Error('얼굴 인식 모델을 로드하는데 실패했습니다.');
  }
}

export interface FaceAnalysisResult {
  landmarks: faceapi.FaceLandmarks68;
  expressions: faceapi.FaceExpressions;
  detection: faceapi.FaceDetection;
}

export async function analyzeFaceImage(imageElement: HTMLImageElement): Promise<FaceAnalysisResult> {
  if (!isInitialized) {
    throw new Error('Face API가 초기화되지 않았습니다.');
  }

  try {
    const detections = await faceapi
      .detectAllFaces(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();

    if (detections.length === 0) {
      throw new Error('얼굴을 감지할 수 없습니다. 얼굴이 명확히 보이는 사진을 사용해주세요.');
    }

    if (detections.length > 1) {
      throw new Error('여러 개의 얼굴이 감지되었습니다. 한 명의 얼굴만 포함된 사진을 사용해주세요.');
    }

    const detection = detections[0];
    
    return {
      landmarks: detection.landmarks,
      expressions: detection.expressions,
      detection: detection.detection,
    };
  } catch (error) {
    console.error('Face analysis error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('얼굴 분석 중 오류가 발생했습니다.');
  }
}

export function extractFacialFeatures(landmarks: faceapi.FaceLandmarks68) {
  const points = landmarks.positions;
  
  return {
    forehead: [
      { x: points[19].x, y: points[19].y - 30 }, // estimated forehead points
      { x: points[24].x, y: points[24].y - 30 },
    ],
    eyes: {
      left: points.slice(36, 42).map(p => ({ x: p.x, y: p.y })),
      right: points.slice(42, 48).map(p => ({ x: p.x, y: p.y })),
    },
    nose: points.slice(27, 36).map(p => ({ x: p.x, y: p.y })),
    mouth: points.slice(48, 68).map(p => ({ x: p.x, y: p.y })),
    chin: [
      { x: points[8].x, y: points[8].y },
    ],
    jawline: points.slice(0, 17).map(p => ({ x: p.x, y: p.y })),
  };
}
