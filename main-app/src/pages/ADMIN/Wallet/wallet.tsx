import React from "react";
import Layout from "../../DashboardLayout";
import { Card, Form, Input, TableColumnsType } from "antd";
import { avatar, FilterIcon } from "../../../assets";
import { Button, Table } from "../../../components";
import { getRandomDate, getRandomItem } from "../../../utils/helperFunction";
import { useScreenSize } from "../../../utils/hooks/useScreen";

const instructorNames = [
	"Aluko Folajimi",
	"John Doe",
	"Jane Smith",
	"Chris Johnson",
];
const courses = ["Agriculture", "Engineering", "Mathematics", "Physics"];

const columns: TableColumnsType<any> = [
	{
		title: "Student Name",
		dataIndex: "student_name",
	},
	{
		title: "Instructor Name",
		dataIndex: "instructor_name",
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
		title: "Date",
		dataIndex: "date",
	},
];

const WalletPage: React.FC = () => {
	const { isMobile } = useScreenSize();
	// const nav = useNavigate();

	const data: any = [];
	for (let i = 0; i < 106; i++) {
		data.push({
			key: i,
			student_name: (
				<div className="flex gap-2 items-center">
					<img src={avatar} alt="avatar" width={20} />
					<p>{getRandomItem(instructorNames)}</p>
				</div>
			),
			instructor_name: (
				<div className="flex gap-2 items-center">
					<img src={avatar} alt="avatar" width={20} />
					<p>{getRandomItem(instructorNames)}</p>
				</div>
			),
			course: getRandomItem(courses),
			amount: `$${Math.floor(Math.random() * 10) + 10}`,
			date: getRandomDate(),
		});
	}
	return (
		<Layout title="Wallet" hasMargin={!isMobile} isAdmin>
			<Card className="my-4 p-3 course_card">
				<header className="flex justify-between items-center">
					<div className="flex items-baseline gap-4">
						<h2 className="text-[16px] inter-bold">Available Balance: $500</h2>

						<Form>
							<Form.Item>
								<Input
									placeholder="Search "
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
							className="text-[#808080] p-3 bg-transparent border-[#808080] border rounded-[5px]"
						/>
					</div>
				</header>

				<Table
					className="mt-[20px]"
					columns={columns}
					data={data}
					type={"selection"}
				/>
			</Card>
		</Layout>
	);
};

export default WalletPage;
