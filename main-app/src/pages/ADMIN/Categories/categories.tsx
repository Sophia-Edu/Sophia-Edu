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
import moment from "moment";

const columns: TableColumnsType<any> = [
	{
		title: "ID",
		dataIndex: "id",
	},
	{
		title: "Name",
		dataIndex: "name",
	},
	{
		title: "Date Created",
		dataIndex: "date",
	},
	{
		title: "",
		dataIndex: "more",
	},
];

const CategoriesPage: React.FC = () => {
	const { isMobile } = useScreenSize();
	const nav = useNavigate();
	const [data, setData] = useState<any>([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [loading, setLoading] = useState(false);
	const [_, setCategoryId] = useState(0);
	
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await adminRequests.getCategories();
				setData(res.data || []);
			} catch (error) {
				console.error("Error fetching categories:", error);
				message.error("Failed to fetch categories");
			}
		};
		fetchData();
	}, [loading]);

	const handleDelete = async (id: number) => {
		setIsModalVisible(true);
		setCategoryId(id);
	};
	
	const handleOk = async () => {
		// const id = data[categoryId]?.id;
		setLoading(true);
		try {
			// Implement delete category API call when available
			// await adminRequests.deleteCategory(id);
			message.success("Category deleted successfully.");
			// Refresh the data
			const res = await adminRequests.getCategories();
			setData(res.data || []);
		} catch (error) {
			message.error("Failed to delete the category.");
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
			label: <div className="text-[14px] cursor-pointer">View Category</div>,
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
		const categoryID = i;
		returnedData.push({
			key: i,
			id: data[i]?.id,
			name: data[i]?.name,
			more: (
				<Dropdown menu={{ items: getDropdownItems(categoryID) }}>
					<Space className="cursor-pointer">...</Space>
				</Dropdown>
			),
			date: data[i]?.created_at ? moment(data[i]?.created_at).format("YYYY-M-D h:mma") : "N/A",
		});
	}

	return (
		<Layout title="Categories" hasMargin={!isMobile} isAdmin>
			<Card className="my-4 p-3 course_card">
				<header className="flex justify-between items-center">
					<div className="flex items-baseline gap-4">
						<h2 className="text-[16px] inter-bold">{data?.length} Categories</h2>

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
							label="Create a new category"
							onclick={() => nav(URL.ADMIN_CREATE_CATEGORY)}
							className="text-[#fff] p-[20px] bg-[#581A57] border rounded-[5px]"
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
					<p>Are you sure you want to delete this category?</p>
				</Modal>
			</Card>
		</Layout>
	);
};

export default CategoriesPage;