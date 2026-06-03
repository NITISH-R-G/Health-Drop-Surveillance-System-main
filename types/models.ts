export interface Region {
  id: string;
  name: string;
  district: string;
  population: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  activeCases?: number; // Added for proportional circle sizing
}

export interface Outbreak {
  id: number;
  title: string;
  description: string;
  location: string;
  regionId: string;
  date: string;
  type: 'outbreak' | 'water_quality' | 'prevention' | 'alert';
  severity: 'critical' | 'high' | 'medium' | 'low';
  caseCount?: number;
  status: 'active' | 'contained' | 'resolved';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface WaterQualityReading {
  id: number;
  sourceId: string;
  sourceName: string;
  location: string;
  regionId: string;
  date: string;
  ph: number;
  turbidity: number;
  bacterialCount: number;
  status: 'safe' | 'warning' | 'danger';
}

export interface TrendDataPoint {
  label: string;
  value: number;
}

export interface AlertItem {
  id: number;
  title: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  regionId?: string;
  region?: string;
  type?: 'disease' | 'water' | 'system' | 'weather';
  category?: 'outbreak' | 'prevention' | 'system' | 'water' | 'prediction';
  isRead?: boolean;
}

export interface PredictionInsightFactor {
  name: string;
  impact: number;
  direction: string;
}

export interface PredictionInsight {
  id: number;
  region: string;
  disease: string;
  probability: number;
  timeframe: string;
  confidence: number;
  factors: PredictionInsightFactor[];
  reasoning: string;
}

export interface EnvironmentalData {
  regionId: string;
  rainfall: number;
  temperature: number;
  humidity: number;
  waterLevel: number;
}
