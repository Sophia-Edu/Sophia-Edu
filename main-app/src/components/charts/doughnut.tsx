// src/components/DonutChart.tsx
import React from "react";
import { Card } from "antd";
import { Doughnut } from "react-chartjs-2";
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	ChartData,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
	title: string;
	data: ChartData<"doughnut">;
	options?: any;
}

const DonutChart: React.FC<DonutChartProps> = ({ data, options }) => (
	<Card className="m-2 !border-none">
		{/* <h3 className="text-xl font-bold mb-4">{title}</h3> */}
		<Doughnut data={data} options={options} />
	</Card>
);

export default DonutChart;
