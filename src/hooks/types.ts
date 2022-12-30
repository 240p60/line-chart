export interface Coin {
	id: number;
	symbol: string;
	partner_symbol?: string;
	data_available_from?: number;
}

export interface QueryParams {
	lazy?: boolean;
}
