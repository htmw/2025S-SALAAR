export interface DetectionResult {
    status: 'Healthy' | 'Diseased';
    disease: string | null;
    confidence: number;
    advice: string | null;
  }
  
  export interface ScanHistory {
    id: string;
    date: string;
    image: string;
    result: DetectionResult;
  }