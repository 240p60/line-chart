import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LineElement,
	PointElement,
	LinearScale,
	Title
} from "chart.js";

ChartJS.register(CategoryScale, LineElement, PointElement, LinearScale, Title);

export const UserData = [
	{
		id: 1,
		year: 2016,
		userGain: 80000,
		userLost: 823
	},
	{
		id: 2,
		year: 2017,
		userGain: 45677,
		userLost: 345
	},
	{
		id: 3,
		year: 2018,
		userGain: 78888,
		userLost: 555
	},
	{
		id: 4,
		year: 2019,
		userGain: 90000,
		userLost: 4555
	},
	{
		id: 5,
		year: 2020,
		userGain: 4300,
		userLost: 234
	}
];

interface ChartViewProps {
	chartData: {
		time: number;
		volume: number;
	}[];
}

const ChartView = ({ chartData }: ChartViewProps) => {
	const [data, setData] = useState(() => formatData());

	function formatData() {
		return {
			labels: chartData.map((data) => new Date(data.time).toLocaleDateString()),
			datasets: [
				{
					label: "Volume",
					data: chartData.map((data) => data.volume),
					backgroundColor: ["rgba(75,192,192,1)", "#ecf0f1", "#50AF95", "#f3ba2f", "#2a71d0"],
					borderColor: "white",
					borderWidth: 2
				}
			]
		};
	}

	useEffect(() => {
		setData(formatData());
	}, [chartData]);

	return (
		<div>
			<Line data={data} />
		</div>
	);
};

export default ChartView;
