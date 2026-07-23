// Phase 9 – Stock Components
export interface InventoryStats {
  totalCount: number;
  totalChecked: number;
  totalUnchecked: number;
  loading?: boolean;
  refreshing?: boolean;
}

export interface InventoryStatsCardProps {
  stats: InventoryStats;
  loading?: boolean;
  refreshing?: boolean;
}
