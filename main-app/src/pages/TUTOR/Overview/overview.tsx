import React from "react";
import Layout from "../../DashboardLayout";
import {
	IndicatorIcon,
	SquaredBook,
	SquaredDollarIcon,
	StudentsIcon2,
} from "../../../assets";
import { CalendarOutlined } from "@ant-design/icons";
import DonutChart from "../../../components/charts/doughnut";
import Bar from "../../../components/charts/barCharts";
import { Table } from "../../../components";

const dataSource = [
	{
		key: "1",
		transaction_id: "#1234567890",
		amount: "NGN5,000",
		type: "Purchase",
	},
	{
		key: "2",
		transaction_id: "#1234567890",
		amount: "NGN5,000",
		type: "Gift",
	},
];

const columns = [
	{
		title: "Transaction ID",
		dataIndex: "transaction_id",
		key: "transaction_id",
	},
	{
		title: "Amount",
		dataIndex: "amount",
		key: "amount",
	},
	{
		title: "Type",
		dataIndex: "type",
		key: "type",
	},
];

const data = {
	labels: [],
	datasets: [
		{
			label: "# of Votes",
			data: [12, 19, 3],
			backgroundColor: ["#25CF55", "#F4BE37", "#FF0000"],
			borderColor: ["#25CF55", "#F4BE37", "#FF0000"],
			borderWidth: 1,
		},
	],
};
const barData = {
	labels: [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"July",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	],
	datasets: [
		{
			label: "# of earnings",
			data: [1000, 100, 350, 500, 200, 300, 200, 750, 180, 200, 220, 100],
			backgroundColor: [
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
			],
			borderColor: [
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
				"#581A57",
			],
			borderWidth: 1,
		},
	],
};

const barOptions = {
	responsive: true,
	maintainAspectRatio: false,
	scales: {
		x: {
			grid: {
				display: false, // Hide grid lines on x-axis
			},
		},
		y: {
			beginAtZero: true,
			grid: {
				display: false, // Hide grid lines on x-axis
			},
		},
	},
};

const options = {
	responsive: true,
	maintainAspectRatio: false,
	cutout: "50%",
	plugins: {
		tooltip: {
			position: "nearest",
			padding: 10,
			callbacks: {
				label: function (tooltipItem: any) {
					return `${tooltipItem.label}: ${tooltipItem.raw}`;
				},
			},
		},
	},
};

const Overview: React.FC = () => {
	return (
		<Layout title="Overview">
			<div className="container mx-auto px-0 sm:px-4 p-4">
				<div className="mb-[30px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					<div className="flex items-center px-[20px] gap-2 h-[100px] bg-white rounded-[8px] border-[#DBDBDB] border-1">
						<StudentsIcon2 />
						<div>
							<p className="text-[16px] inter-normal">My Students</p>
							<p className="font-medium text-[18px]">500</p>
						</div>
					</div>

					<div className="flex items-center px-[20px] gap-2 h-[100px] bg-white rounded-[8px] border-[#DBDBDB] border-1">
						<StudentsIcon2 color1="#E4FFDA" color2="#2BD059" />
						<div>
							<p className="text-[16px] inter-normal">New Students</p>
							<p className="font-medium text-[18px]">500</p>
						</div>
					</div>
					<div className="flex items-center px-[20px] gap-2 h-[100px] bg-white rounded-[8px] border-[#DBDBDB] border-1">
						<SquaredBook />
						<div>
							<p className="text-[16px] inter-normal">My Courses</p>
							<p className="font-medium text-[18px]">500</p>
						</div>
					</div>
					<div className="flex items-center px-[20px] gap-2 h-[100px] bg-white rounded-[8px] border-[#DBDBDB] border-1">
						<SquaredDollarIcon />
						<div>
							<p className="text-[16px] inter-normal">My Earnings</p>
							<p className="font-medium text-[18px]">$500</p>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2  gap-4">
					<div className="px-[20px] gap-2 h-[300px] bg-white rounded-[8px] border-[#DBDBDB] border-1">
						<header className="p-3 flex-col sm:flex-row flex items-center justify-between">
							<h2 className="text-[16px] inter-bold">Earning Overview</h2>
							<div className="rounded-[5px] border py-1 px-2 border-[#B6B6B6]">
								<span>05/06/2022 - 05/06/2022 </span>
								<CalendarOutlined />
							</div>
						</header>
						<Bar title="Sample Bar Chart" data={barData} options={barOptions} />
					</div>

					<div className="px-[20px] gap-2 h-[300px] bg-white rounded-[8px] border-[#DBDBDB] border-1">
						<header className="p-3 flex flex-col sm:flex-rowitems-center justify-between">
							<h2 className="text-[16px] inter-bold">Sales</h2>
							<div className="rounded-[5px] border py-1 px-2 border-[#B6B6B6]">
								<span>05/06/2022 - 05/06/2022 </span>
								<CalendarOutlined />
							</div>
						</header>
						<Table data={dataSource} columns={columns} pagination={false} />
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3  gap-4 my-[30px] px-[20px] sm:py-0 py-[10px] min-h-[300px] sm:min-h-0 sm:h-[300px] bg-white rounded-[8px] border-[#DBDBDB] border-1">
					<div className="relative flex flex-col items-center justify-center">
						<h2 className="font-medium inter-bold text-[16px]">Courses</h2>
						<DonutChart
							title="Sample Donut Chart"
							data={data}
							options={options}
						/>
						<div className="absolute bottom-[82px] sm:bottom-[109px]">
							<p className="inter-normal text-[12px] sm:text-[14px] text-center">
								Course
							</p>
							<p className="inter-bold text-[16px] text-center">500</p>
						</div>
						<div className="flex gap-3">
							<div className="flex items-center gap-1">
								<IndicatorIcon color="#25CF55" />
								<span>Active</span>
							</div>
							<div className="flex items-center gap-1">
								<IndicatorIcon color="#FF0000" />
								<span>Inactive</span>
							</div>
							<div className="flex items-center gap-1">
								<IndicatorIcon color="#F4BE37" />
								<span>Pending</span>
							</div>
						</div>
					</div>
					<div className="relative flex flex-col items-center justify-center">
						<h2 className="font-medium inter-bold text-[16px]">
							Students Details
						</h2>
						<DonutChart
							title="Sample Donut Chart2"
							data={data}
							options={options}
						/>
						<div className="absolute bottom-[82px] sm:bottom-[109px]">
							<p className="inter-normal text-[12px] sm:text-[14px] text-center">
								Student
							</p>
							<p className="inter-bold text-[16px] text-center">500</p>
						</div>
						<div className="flex gap-3">
							<div className="flex items-center gap-1">
								<IndicatorIcon color="#25CF55" />
								<span>Active</span>
							</div>
							<div className="flex items-center gap-1">
								<IndicatorIcon color="#FF0000" />
								<span>Inactive</span>
							</div>
							<div className="flex items-center gap-1">
								<IndicatorIcon color="#F4BE37" />
								<span>Pending</span>
							</div>
						</div>
					</div>
					<div className="relative flex flex-col items-center justify-center">
						<h2 className="font-medium inter-bold text-[16px]">
							Earning Details
						</h2>
						<DonutChart
							title="Sample Donut Chart3"
							data={data}
							options={options}
						/>
						<div className="absolute bottom-[82px] sm:bottom-[109px]">
							<p className="inter-normal text-[12px] sm:text-[14px] text-center">
								Earning
							</p>
							<p className="inter-bold text-[16px] text-center">500</p>
						</div>
						<div className="flex gap-3">
							<div className="flex items-center gap-1">
								<IndicatorIcon color="#25CF55" />
								<span>Active</span>
							</div>
							<div className="flex items-center gap-1">
								<IndicatorIcon color="#FF0000" />
								<span>Inactive</span>
							</div>
							<div className="flex items-center gap-1">
								<IndicatorIcon color="#F4BE37" />
								<span>Pending</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default Overview;
