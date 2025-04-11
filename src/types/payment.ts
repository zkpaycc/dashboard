export interface Token {
  category: string;
  address?: string;
}

export type PaymentStatus = "active" | "partial" | "received";
