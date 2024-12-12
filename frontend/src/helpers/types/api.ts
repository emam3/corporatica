export interface tabularAnalysisResult {
    [key: string]: {
      max: number;
      mean: number;
      median: number;
      min: number;
      mode: number;
    };
  }