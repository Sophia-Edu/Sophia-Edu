// src/components/BarChart.tsx
import React from "react";
import { Card } from "antd";
import { Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ChartOptions,
	ChartData,
} from "chart.js";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend
);

interface BarChartProps {
	title: string;
	data: ChartData<"bar">;
	options?: ChartOptions<"bar">;
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => (
	<Card className="m-2 !border-none">
		<Bar data={data} options={options} />
	</Card>
);

export default BarChart;
