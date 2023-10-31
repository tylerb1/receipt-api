export interface Receipt {
  retailer: string,
  purchaseDate: string,
  purchaseTime: string,
  total: string,
  items: Item[],
}

export interface Item {
  shortDescription: string,
  price: string,
}

export interface processReceiptResponse {
  id: string,
}

export interface getPointsResponse {
  points: number,
}