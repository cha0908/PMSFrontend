export interface Position {
  positionId: string;
  ticker: string;
  totalQty: string;
  avgPrice: string;
  unrealizedPnl: string;
  currency: string;
  lastPrice: string;
}

export interface Positions {
  positionData: Position[];
} 