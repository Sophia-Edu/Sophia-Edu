import React, { useState } from "react";
import Layout from "../../Layout";
import { WalletIcon } from "../../../assets";
import { Table, TableProps, Tag } from "antd";
import { WalletModal } from "./wallet_modal";
interface DataType {
	key: string;
	s_n: number;
	transaction_id: string;
	amount: string;
	status: string;
	type: string;
	date_and_time: string;
}

const columns: TableProps<DataType>["columns"] = [
	{
		title: "S/N",
		dataIndex: "s_n",
		key: "s_n",
		render: (text: any) => <a>{text}</a>,
	},
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
	{
		title: "Date and Time",
		dataIndex: "date_and_time",
		key: "date_and_time",
	},
	{
		title: "Status",
		key: "status",
		dataIndex: "status",
		render: (status: string) => {
			let color = "";
			if (status === "Pending") {
				color = "orange";
			} else if (status === "Completed") {
				color = "green";
			} else if (status === "Failed") {
				color = "red";
			}
			return (
				<Tag className="rounded-3xl p-1 px-2" color={color}>
					{status}
				</Tag>
			);
		},
	},
];

const getRandomType = () => (Math.random() > 0.5 ? "Top Up" : "Withdraw");

const data: DataType[] = [
	{
		key: "1",
		s_n: 1,
		transaction_id: "TXN1234567890",
		amount: "$100.00",
		status: "Completed",
		type: getRandomType(),
		date_and_time: "2024-06-01 10:30",
	},
	{
		key: "2",
		s_n: 2,
		transaction_id: "TXN0987654321",
		amount: "$150.50",
		status: "Pending",
		type: getRandomType(),
		date_and_time: "2024-06-02 11:45",
	},
	{
		key: "3",
		s_n: 3,
		transaction_id: "TXN5678901234",
		amount: "$200.00",
		status: "Failed",
		type: getRandomType(),
		date_and_time: "2024-06-03 12:00",
	},
	{
		key: "4",
		s_n: 4,
		transaction_id: "TXN4321098765",
		amount: "$75.75",
		status: "Completed",
		type: getRandomType(),
		date_and_time: "2024-06-04 13:15",
	},
	{
		key: "5",
		s_n: 5,
		transaction_id: "TXN3456789012",
		amount: "$50.25",
		status: "Pending",
		type: getRandomType(),
		date_and_time: "2024-06-05 14:30",
	},
];

const Wallet: React.FC<any> = () => {
	const [type, setType] = useState("");
	const [loading, setLoading] = useState(false);

	const handleToggleButton = (type: string) => {
		setType(type);
	};
	const handleSubmit = () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 2000);
	};
	return (
		<Layout>
			<div className="w-[90%] relative sm:w-4/5 mx-auto  wallet">
				<div className="flex flex-col mt-[50px]  items-center justify-center">
					<h4 className="text-[#808080] text-[16px]">Total Balance</h4>
					<h2 className="font-semibold text-[48px] sm:text-[58.44px]">
						$25,000.00
					</h2>
					<div className="flex gap-4">
						<div
							onClick={() => handleToggleButton("top_up")}
							className="py-[20px] whitespace-nowrap sm:py-[40px] px-[60px] sm:px-[100px] flex cursor-pointer flex-col items-center bg-[#581A57] text-white rounded-md"
						>
							<WalletIcon />
							<p>Top Up</p>
						</div>

						<div
							onClick={() => handleToggleButton("withdraw")}
							className="py-[20px] sm:py-[40px] px-[60px] sm:px-[100px] cursor-pointer flex flex-col items-center bg-[#008FE4] text-white rounded-md"
						>
							<WalletIcon />
							<p>Withdraw</p>
						</div>
					</div>
					<Table
						columns={columns}
						dataSource={data}
						className="w-full customtable my-[30px] bg-white whitespace-nowrap"
					/>
					<WalletModal
						handleSubmit={handleSubmit}
						type={type}
						onClose={() => setType("")}
						btnLoading={loading}
					/>
				</div>
			</div>
		</Layout>
	);
};

export default Wallet;
