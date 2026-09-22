export interface DeviceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface WorkingStep {
  title: string;
  description: string;
  icon: string;
}

export interface ComponentInfo {
  name: string;
  description: string;
  function: string;
  icon: string;
}

export interface BlockNode {
  label: string;
  description: string;
  icon: string;
}

export interface TroubleshootingScenario {
  scenario: string;
  symptom: string;
  possibleCauses: string[];
  solution: string;
}

export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface MCQ {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LabControl {
  label: string;
  key: string;
  type: 'slider' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  default: number | string | boolean;
  unit?: string;
  options?: { label: string; value: string }[];
}

export interface LabFault {
  id: string;
  label: string;
  description: string;
  effectOnWaveform?: string;
  alarm?: string;
}

export interface Device {
  id: string;
  name: string;
  categoryId: string;
  icon: string;
  tagline: string;
  description: string;
  image: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  introduction: {
    overview: string;
    clinicalImportance: string;
    applications: string[];
    history: string;
    advantages: string[];
    limitations: string[];
  };
  workingPrinciple: WorkingStep[];
  components: ComponentInfo[];
  blockDiagram: BlockNode[];
  maintenance: {
    calibration: string[];
    preventiveMaintenance: string[];
    electricalSafety: string[];
    dailyInspection: string[];
  };
  troubleshooting: TroubleshootingScenario[];
  vivaQuestions: VivaQuestion[];
  mcqs: MCQ[];
  lab: {
    controls: LabControl[];
    faults: LabFault[];
    waveformType: 'ecg' | 'eeg' | 'emg' | 'pressure' | 'flow' | 'spo2' | 'none';
    guidedSteps: { title: string; description: string }[];
  };
}
