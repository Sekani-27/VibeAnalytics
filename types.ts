
export enum Sentiment {
    POSITIVE = 'POSITIVE',
    NEGATIVE = 'NEGATIVE',
    NEUTRAL = 'NEUTRAL',
}

export interface AnalysisResult {
    text: string;
    sentiment: Sentiment;
    confidence: number;
}

export interface DashboardData {
    positivePercentage: number;
    negativePercentage: number;
    neutralPercentage: number;
    avgConfidence: number;
    sentimentDistribution: { name: string; value: number }[];
    recentScores: { name: string; confidence: number }[];
    totalAnalyzed: number;
    positiveCount: number;
    negativeCount: number;
}
