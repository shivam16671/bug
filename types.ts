
export interface BugItem {
  id: string;
  category: 'Accessibility' | 'Performance' | 'Security' | 'SEO' | 'HTML/CSS';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  solution: string;
  codeSnippet?: string;
}

export interface WebReport {
  url: string;
  scanDate: string;
  score: number;
  bugs: BugItem[];
  summary: string;
}

export enum ScanStatus {
  IDLE = 'IDLE',
  FETCHING = 'FETCHING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
