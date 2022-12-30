import { useState, useEffect } from "react";
import { useQueryCoinList } from "@root/hooks/useQueryCoinList";
import { useQueryVolume } from "@root/hooks/useQueryVolume";
import RadioGroup from "@root/components/RadioGroup";
import Combobox from "@root/components/Combobox";
import ChartView from "./ChartView";
import { Coin } from "@root/hooks/types";

const Chart = () => {
	const [{ data: coinList }] = useQueryCoinList({});
	const [{ data: chartData, isLoading }, fetchData] = useQueryVolume({ lazy: true });
	const [selectedCoin, setSelectedCoin] = useState(
		coinList?.[0] || {
			id: 1,
			symbol: ""
		}
	);

	useEffect(() => {
		fetchData(selectedCoin.symbol || "BTC", 200);
	}, [selectedCoin]);

	const changeCoin = (data: Coin) => {
		if (data) {
			setSelectedCoin(data);
		}
	};

	return (
		<div>
			<div className="flex items-center justify-between pt-4 pb-8 gap-5 w-full">
				<RadioGroup className="flex items-center justify-start gap-2" />
				<Combobox options={coinList} selected={selectedCoin} handleChange={changeCoin} />
			</div>
			{isLoading && "Loading..."}
			{chartData && <ChartView chartData={chartData} />}
		</div>
	);
};

export default Chart;
