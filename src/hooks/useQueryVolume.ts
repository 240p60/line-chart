import { useState, useEffect, useRef } from "react";
import { QueryParams } from "./types";

interface ResponseFormat {
	Type: number;
	Message: string;
	Data: {
		time: number;
		volume: number;
	}[];
	TimeFrom: number;
	TimeTo: number;
	FirstValueInArray: boolean;
	ConversionType: "direct";
	RateLimit: {};
	HasWarning: boolean;
}

interface QueryData {
	data:
		| {
				time: number;
				volume: number;
		  }[]
		| null;
	error: string | null;
	isLoading: boolean;
	isError: boolean;
}

const url = import.meta.env.VITE_API_URL;
const key = import.meta.env.VITE_API_KEY;
const appName = import.meta.env.VITE_APP_NAME;

export const useQueryVolume = ({
	lazy = false
}: QueryParams): [QueryData, (coin: string, limit: number) => Promise<void>] => {
	const [data, setData] = useState<QueryData>({
		data: null,
		error: null,
		isError: false,
		isLoading: false
	});

	const cache = useRef<Record<string, QueryData>>({});

	const fetchData = async (coin = "BTC", limit = 50) => {
		setData({
			data: null,
			error: null,
			isError: false,
			isLoading: true
		});

		try {
			if (!key) {
				throw new Error("You need a valid api key to access this endpoint");
			}
			if (cache.current && cache.current[coin + limit]) {
				setData(cache.current[coin + limit]);
				return;
			}

			const response = await fetch(
				`${url}/exchange/histohour?tsym=${coin}&limit=${limit}&extraParams=${appName}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Apikey ${key}`
					}
				}
			);

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const res: ResponseFormat = await response.json();
			const newData = {
				data: res.Data,
				error: null,
				isError: false,
				isLoading: false
			};

			if (cache.current) {
				cache.current[coin + limit] = newData;
			}

			setData(newData);
		} catch (error) {
			setData({
				data: null,
				error: error as string,
				isError: true,
				isLoading: false
			});
		}
	};

	useEffect(() => {
		if (!url) {
			return;
		}

		!lazy && fetchData();
	}, []);

	return [data, fetchData];
};
