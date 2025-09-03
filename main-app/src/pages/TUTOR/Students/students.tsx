import React from "react";
import Layout from "../../DashboardLayout";
import { Card, Form, Input, TableColumnsType } from "antd";
import { FilterIcon } from "../../../assets";
import { Button, Table } from "../../../components";
import { getRandomDate, getRandomItem } from "../../../utils/helperFunction";
import { useScreenSize } from "../../../utils/hooks/useScreen";
const studentNames = [
	"Aluko Folajimi",
	"John Doe",
	"Jane Smith",
	"Chris Johnson",
];
const courses = ["Agriculture", "Engineering", "Mathematics", "Physics"];
const reviews = [
	"i enjoyed every bit",
	"Could be better",
	"Excellent course",
	"Very informative",
];
const feedbacks = ["Non Satisfactory", "Satisfactory"];

const columns: TableColumnsType<any> = [
	{
		title: "Student Name",
		dataIndex: "student_name",
	},
	{
		title: "Course Enrolled",
		dataIndex: "course_enrolled",
	},
	{
		title: "Date of purchase",
		dataIndex: "date_of_purchase",
	},
	{
		title: "Review",
		dataIndex: "review",
	},
	{
		title: "",
		dataIndex: "feedback",
	},
];

const data: any[] = [];
for (let i = 0; i < 106; i++) {
	data.push({
		key: i,
		student_name: getRandomItem(studentNames),
		course_enrolled: getRandomItem(courses),
		review: (
			<div className="flex gap-2">
				<span className="inter-normal text-[14px]">
					{getRandomItem(reviews)}
				</span>
				<span className="text-[#800080] inter-normal text-[14px]">
					see more
				</span>
			</div>
		),
		feedback: (
			<div className="text-[14px] inter-normal text-[#008FE4]">
				{getRandomItem(feedbacks)}
			</div>
		),
		date_of_purchase: getRandomDate(),
	});
}

const StudentsPage: React.FC = () => {
	const { isMobile } = useScreenSize();
	return (
		<Layout title="Students" hasMargin={!isMobile}>
			<Card className="my-4 p-3 course_card">
				<header className="flex justify-between items-center">
					<div className="flex items-baseline gap-4">
						<h2 className="text-[16px] inter-bold">{data?.length} Students</h2>

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

export default StudentsPage;
