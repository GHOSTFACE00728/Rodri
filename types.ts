export enum GameState {
  MENU = 'MENU',
  ORDERING = 'ORDERING',
  CLINICAL = 'CLINICAL',
  VISUAL = 'VISUAL',
  REFERENCE = 'REFERENCE'
}

export interface CranialNerve {
  id: number;
  roman: string;
  name: string;
  functionType: 'Sensorial' | 'Motor' | 'Misto';
  description: string;
  keyFunction: string;
}

export interface ClinicalScenario {
  description: string;
  correctNerveId: number;
  explanation: string;
}
