// Phase 7 – Estimation Components
export interface EstimationRow {
  [key: string]: unknown;
}

export interface EstimationTableProps {
  data: EstimationRow[];
  onRemoveRow: (index: number) => void;
  /** Calculation helpers from useEstimation (unchanged business logic). */
  calculateGrossAmount: (row: EstimationRow) => number;
  calculateGST: (row: EstimationRow) => number;
  calculateGrandTotal: (row: EstimationRow) => number;
}
