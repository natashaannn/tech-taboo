export interface TabooWord {
  index: number;
  word: string;
  taboo: string[];
  explanation: string;
}

export interface TabooCard {
  id: string;
  top: TabooWord;
  bottom: TabooWord;
  createdAt: Date;
}

export interface Category {
  name: string;
  color: string;
  textColor: string;
  keywords: string[];
}

export interface CardGenerationOptions {
  baseColor: string;
  background: string;
  strokeColor: string;
  matchStrokeBackground: boolean;
  showBleed: boolean;
  category?: string;
  teacherImage?: string;
  peekOutImage?: string;
}
