export interface Program {
  programID: string;
  programNumber: string;
  programName: string;
  programDescription: string;
  canDelete: boolean;
  isActive: boolean;
  programBudget: number;
  isVirtual: boolean;
}
