
export enum AppStep {
  Introduction,
  Demographics,
  Survey,
  ThankYou,
}

export interface Demographics {
  gender: string;
  age: string;
}

export interface ColorSelection {
  id: number;
  x: number;
  y: number;
  color: string; // hex color string
}

export interface SurveyImage {
  image: string;
  selections: ColorSelection[];
}

export interface SurveyResult {
    demographics: Demographics;
    survey: SurveyImage[];
}
