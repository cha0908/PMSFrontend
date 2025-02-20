export interface Position {
  PositionID: string;
  Symbol: string;
  Qty: number;
  AverageCost: number;
  UnrealizedPnL: number;
  Currency: string;
  CurrentPrice: number;
}

export interface Positions {
  [key: string]: Position;
} 