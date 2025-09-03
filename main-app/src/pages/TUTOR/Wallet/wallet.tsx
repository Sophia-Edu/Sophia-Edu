import React, { useState } from "react";
import Layout from "../../DashboardLayout";
import { Card, Form, Input, TableColumnsType } from "antd";
import { avatar, FilterIcon } from "../../../assets";
import { Button, Table } from "../../../components";
import { getRandomDate, getRandomItem } from "../../../utils/helperFunction";
import { WalletModal } from "./wallet_modal";
import { useScreenSize } from "../../../utils/hooks/useScreen";

const studentNames = [
	"Aluko Folajimi",
	"John Doe",
	"Jane Smith",
	"Chris Johnson",
];
const courses = ["Agriculture", "Engineering", "Mathematics", "Physics"];
const amount = ["10$", "25$", "45$", "50$"];
const statusList = ["Completed", "Pending", "Failed"];

const columns: TableColumnsType<any> = [
	{
		title: "Student Name",
		dataIndex: "student_name",
	},
	{
		title: "Course",
		dataIndex: "course",
	},
	{
		title: "Amount",
		dataIndex: "amount",
	},
	{
		title: "Date of purchase",
		dataIndex: "date_of_purchase",
	},
	{
		title: "Status",
		dataIndex: "status",
	},
];

const data: any[] = [];
for (let i = 0; i < 25; i++) {
	const status = getRandomItem(statusList);
	data.push({
		key: i,
		student_name: (
			<div className="flex gap-2 items-center">
				<img src={avatar} width={20} alt="..." />
				<span>{getRandomItem(studentNames)}</span>
			</div>
		),
		course: getRandomItem(courses),
		amount: getRandomItem(amount),
		date_of_purchase: getRandomDate(),
		status: (
			<div
				className={`text-[14px] rounded-[100px] py-2 border text-center w-[150px] ${
					status === "Completed"
						? "border-[#2E7D32] bg-[#2E7D320D] text-[#2E7D32]"
						: status === "Failed"
						? "border-[#D32F2F] bg-[#D32F2F0D] text-[#D32F2F]"
						: "border-[#FFC107] bg-[#FFC1070D] text-[#FFC107]"
				} inter-normal`}
			>
				{status}
			</div>
		),
	});
}

const WalletPage: React.FC = () => {
	const [type, setType] = useState("");
	const [loading, setLoading] = useState(false);
	const handleSubmit = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};
	const handleToggleButton = (type: string) => {
		setType(type);
	};

	const { isMobile } = useScreenSize();
	return (
		<Layout title="Wallet" hasMargin={!isMobile}>
			<Card className="my-4 p-3 course_card">
				<header className="flex justify-between items-center">
					<div className="flex items-baseline gap-4">
						<h2 className="text-[16px] inter-bold">Available Balance: $500</h2>
						<Form>
							<Form.Item>
								<Input
									placeholder="Search"
									className="px-2 py-3 !outline-none border-[#DBDBDB] border w-[300px] rounded-[50px]"
								/>
							</Form.Item>
						</Form>
						<div className="flex items-center gap-2 cursor-pointer">
							<FilterIcon />
							<p className="text-[#808080] text-[14px] inter-normal">Filter</p>
						</div>
					</div>
					<div className="flex gap-3">
						<Button
							label="Export"
							className="text-[#808080] !hover:text-[#808080] p-3 bg-transparent !hover:bg-transparent border-[#808080] border rounded-[5px]"
						/>
						<Button
							label="Withdraw"
							onclick={() => handleToggleButton("withdraw")}
							className="text-white !hover:text-[#fff] p-3 bg-[#581A57] !hover:bg-[#581A57] border rounded-[5px]"
						/>
					</div>
				</header>
				<Table
					className="mt-[20px]"
					columns={columns}
					data={data}
					type={"selection"}
				/>
				<WalletModal
					handleSubmit={handleSubmit}
					type={type}
					onClose={() => setType("")}
					btnLoading={loading}
				/>
			</Card>
		</Layout>
	);
};

export default WalletPage;
