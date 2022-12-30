import { useState, useEffect, useRef } from "react";
import { Coin, QueryParams } from "./types";

interface ResponseFormat {
	Response: string;
	Message: string;
	HasWarning: boolean;
	Type: number;
	Data: Record<string, Coin>;
}

interface QueryData {
	data: Coin[] | null;
	error: string | null;
	isLoading: boolean;
	isError: boolean;
}

const url = import.meta.env.VITE_API_URL;
const key = import.meta.env.VITE_API_KEY;
const appName = import.meta.env.VITE_APP_NAME;

export const useQueryCoinList = ({
	lazy = false
}: QueryParams): [QueryData, () => Promise<void>] => {
	const [data, setData] = useState<QueryData>({
		data: null,
		error: null,
		isError: false,
		isLoading: false
	});

	const cache = useRef<QueryData | null>(null);

	const fetchData = async () => {
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
			if (cache.current) {
				setData(cache.current);
				return;
			}

			const response = await fetch(`${url}/blockchain/list?extraParams=${appName}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Apikey ${key}`
				}
			});

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const data: ResponseFormat = await response.json();

			cache.current = {
				data: Object.values(data.Data),
				error: null,
				isError: false,
				isLoading: false
			};

			setData({
				data: Object.values(data.Data),
				error: null,
				isError: false,
				isLoading: false
			});
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
