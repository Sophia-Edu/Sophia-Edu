import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../DashboardLayout";
import { Card, Form, Input, TableColumnsType } from "antd";
import { FilterIcon } from "../../../assets";
import { Button, Table } from "../../../components";
import { useNavigate } from "react-router-dom";
import { useScreenSize } from "../../../utils/hooks/useScreen";
import adminRequests from "../../../requests/admin.request";
import { useAlert } from "../../../store";
import { Dropdown, Menu, Drawer, Modal, message } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

const renderColumns = () => {
    return [
        {
            title: "Course Category",
            dataIndex: "categories",
            render: (categories: string[]) => (
                <span>{categories.join(', ')}</span>
            ),
        },
		{
            title: "Course Name",
            dataIndex: "course_name",
        },
        {
            title: "Course Type",
            dataIndex: "course_type",
        },
        {
            title: "Course Title",
            dataIndex: "title",
            render: (title: string | string[]) => {
                return Array.isArray(title) ? title.join(', ') : title;
            }
        },
		
        {
            title: "Amount (NGN)",
            dataIndex: "price",
            render: (price: number) => price.toLocaleString(),
        },
        {
            title: "No of Students",
            dataIndex: "student_count",
        },
        {
            title: "Date Upload",
            dataIndex: "date_created",
            render: (date: string) => new Date(date).toDateString(),
        },
    ];
};

// const onFilter = () => {};
const Courses: React.FC = () => {
		const navigate = useNavigate();
	const { isMobile } = useScreenSize();
	const [courses, setCourses] = useState<any[]>([]);
	const { onFailure } = useAlert();
	const [loading, setLoading] = useState(false);
	const [tableData, setTableData] = useState<{ total_items?: number, items_per_page?: number, current_page?: number }>({});
	const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingCourse, setDeletingCourse] = useState<any>(null);
    const [editForm] = Form.useForm();

	const columns: TableColumnsType<any> = [
		...renderColumns(),
		{
			title: '',
			dataIndex: 'actions',
			render: (_: any, record: any) => (
				<Dropdown
					overlay={
						<Menu>
							<Menu.Item key="edit" onClick={() => handleEdit(record)}>
								Edit
							</Menu.Item>
							<Menu.Item key="delete" onClick={() => handleDelete(record)}>
								Delete
							</Menu.Item>
						</Menu>
					}
					trigger={["click"]}
				>
					<EllipsisOutlined style={{ fontSize: 24, cursor: "pointer" }} />
				</Dropdown>
			),
			width: 60,
			align: 'center',
		},
	];

	const pagination = useMemo(() => ({
		total: tableData?.total_items ?? 0,
		pageSize: tableData?.items_per_page ?? 10,
		current: tableData?.current_page ?? 1,
	}), [tableData])

	useEffect(() => {
		
		const fetchCourses = async () => {
			setLoading(true);
			try {
				const response: any = await adminRequests.fetchAllCourse();
				setTableData(response ?? {});
				setCourses(response?.items ?? []);
			} catch (error: any) {
				onFailure(error.message);
			} finally {
				setLoading(false);
			}
		}

		fetchCourses();

		return () => {
			setCourses([]);
			setTableData({});
			setLoading(false);
		}
	}, [])

	const handleEdit = (course: any) => {
        setSelectedCourse(course);
        editForm.setFieldsValue(course);
        setEditDrawerOpen(true);
    };

    const handleDelete = (course: any) => {
        setDeletingCourse(course);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            // await adminRequests.deleteCourse(deletingCourse.id);
            message.success("Course deleted successfully");
            setCourses((prev) => prev.filter((c) => c.id !== deletingCourse.id));
        } catch (err: any) {
            message.error("Failed to delete course");
        } finally {
            setDeleteModalOpen(false);
            setDeletingCourse(null);
        }
    };

    const handleEditSubmit = async () => {
        try {
            const values = await editForm.validateFields();
            // await adminRequests.updateCourse(selectedCourse.id, values);
            message.success("Course updated successfully");
            setCourses((prev) => prev.map((c) => c.id === selectedCourse.id ? { ...c, ...values } : c));
            setEditDrawerOpen(false);
            setSelectedCourse(null);
        } catch (err: any) {
            message.error("Failed to update course");
        }
    };

	return (
		<Layout title="Courses" hasMargin={!isMobile} isAdmin>
			<Card className="my-4 p-3 course_card">
				<header className="flex justify-between items-center">
					<div className="flex items-baseline gap-4">
						<h2 className="text-[16px] inter-bold">{courses?.length ?? 0} Courses</h2>

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
					</div>					<div className="flex gap-3">
						<Button
							label="Export"
							className="text-[#808080] p-3 bg-transparent border-[#808080] border rounded-[5px]"
						/>
						<Button
							label="Create Course"
							className="text-white p-3 bg-[#581A57] rounded-[5px]"
							onclick={() => navigate("/admin/courses/create")}
						/>
					</div>
				</header>

				<Table
					className="mt-[20px]"
					columns={columns}
					data={courses}
					type={"selection"}
					loading={loading}
					pagination={pagination}
				/>
				<Drawer
					title="Edit Course"
					width={400}
					onClose={() => setEditDrawerOpen(false)}
					open={editDrawerOpen}
					destroyOnClose
				>
					<Form form={editForm} layout="vertical" onFinish={handleEditSubmit}>
						<Form.Item label="Course Category" name="categories">
							<Input />
						</Form.Item>
						<Form.Item label="Course Type" name="course_type">
							<Input />
						</Form.Item>
						<Form.Item label="Course Title" name="title">
							<Input />
						</Form.Item>
						<Form.Item label="Amount" name="price">
							<Input type="number" />
						</Form.Item>
						<Button htmlType="submit" label="Save" className="bg-[#581A57] text-white mt-2" />
					</Form>
				</Drawer>
				<Modal
					title="Delete Course"
					open={deleteModalOpen}
					onOk={confirmDelete}
					onCancel={() => setDeleteModalOpen(false)}
					okText="Delete"
					okButtonProps={{ danger: true }}
				>
					Are you sure you want to delete this course?
				</Modal>
			</Card>
		</Layout>
	);
};

export default Courses;
