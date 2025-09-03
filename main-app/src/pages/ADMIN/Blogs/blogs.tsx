import React, { useEffect, useState } from "react";
import Layout from "../../DashboardLayout";
import {
	Card,
	Dropdown,
	Form,
	Input,
	message,
	Space,
	TableColumnsType,
} from "antd";
import { FilterIcon } from "../../../assets";
import { Button, Modal, Table } from "../../../components";
import { useScreenSize } from "../../../utils/hooks/useScreen";
import { useNavigate } from "react-router-dom";
import { URL } from "../../../utils/constants";
import adminRequests from "../../../requests/admin.request";
import { truncate } from "lodash";
import moment from "moment";
import { getAvatar } from "../../../utils/helperFunction";

const columns: TableColumnsType<any> = [
	{
		title: "Author",
		dataIndex: "author",
	},
	{
		title: "Heading",
		dataIndex: "heading",
	},
	{
		title: "Body",
		dataIndex: "content",
	},
	{
		title: "Date",
		dataIndex: "date",
	},
	{
		title: "",
		dataIndex: "more",
	},
];

const BlogsPage: React.FC = () => {
	const { isMobile } = useScreenSize();
	const nav = useNavigate();
	const [data, setData] = useState<any>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [blogId, setBlogId] = useState(0);
	useEffect(() => {
		const fetchData = async () => {
			const res = await adminRequests.getBlogs();
			setData(res);
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			const res = await adminRequests.getBlogs();
			setData(res);
		};
		fetchData();
	}, [loading]);

	const handleDelete = async (id: number) => {
		setIsModalVisible(true);
		setBlogId(id);
	};
	const handleOk = async () => {
		const id = data[blogId]?.id;
		setLoading(true);
		try {
			await adminRequests.deleteBlog(id);
			message.success("Blog deleted successfully.");
		} catch (error) {
			message.error("Failed to delete the blog.");
			console.error(error);
		} finally {
			setLoading(false);
			setIsModalVisible(false); // Close the modal after deletion
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};
	const getDropdownItems = (id: number) => [
		{
			key: "1",
			label: <div className="text-[14px] cursor-pointer">View Blog</div>,
		},
		{
			key: "2",
			label: (
				<div
					className="text-[14px] cursor-pointer"
					onClick={() => handleDelete(id)}
				>
					Delete
				</div>
			),
		},
	];

	const returnedData: any = [];
	for (let i = 0; i < data?.length; i++) {
		const instructorID = i;
		returnedData.push({
			key: i,
			author: (
				<div className="flex gap-2 items-center">
					<img
						src={getAvatar(data[i]?.author_profile_image)}
						alt="avatar"
						style={{
							borderRadius: "50%",
							objectFit: "cover",
							width: 23,
							height: 23,
						}}
					/>
					<p>{data[i]?.author}</p>
				</div>
			),
			heading: data[i]?.title,
			content: truncate(data[i]?.content),
			more: (
				<Dropdown menu={{ items: getDropdownItems(instructorID) }}>
					<Space className="cursor-pointer">...</Space>
				</Dropdown>
			),
			date: moment(data[i]?.date_created).format("YYYY-M-D h:mma"),
		});
	}

	return (
		<Layout title="Blogs" hasMargin={!isMobile} isAdmin>
			<Card className="my-4 p-3 course_card">
				<header className="flex justify-between items-center">
					<div className="flex items-baseline gap-4">
						<h2 className="text-[16px] inter-bold">{data?.length} Blogs</h2>

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
							label="Create a new post"
							onclick={() => nav(URL.ADMIN_CREATE_BLOGS)}
							className="text-[#fff] p-[20px] bg-[#581A57]  border rounded-[5px]"
						/>
					</div>
				</header>

				<Table
					className="mt-[20px]"
					columns={columns}
					data={returnedData}
					type={"selection"}
				/>
				<Modal
					title="Confirm Deletion"
					isOpen={isModalVisible}
					onOk={handleOk}
					confirmLoading={loading}
					onClose={handleCancel}
					okText="Yes"
					footer={[
						<Button label="No" key="back" onclick={handleCancel} />,
						<Button
							key="submit"
							label="Yes"
							type="primary"
							loading={loading}
							onclick={handleOk}
						/>,
					]}
					cancelText="No"
				>
					<p>Are you sure you want to delete this blog?</p>
				</Modal>
			</Card>
		</Layout>
	);
};

export default BlogsPage;
