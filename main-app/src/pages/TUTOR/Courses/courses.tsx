import React, {useEffect, useState} from "react";
import Layout from "../../DashboardLayout";
import {Card, Dropdown, Form, Input, Space, TableColumnsType, Drawer, Modal, message, Select} from "antd";
import {FilterIcon} from "../../../assets";
import {Button, Table} from "../../../components";
import {useNavigate} from "react-router-dom";
import {URL} from "../../../utils/constants";
import {useScreenSize} from "../../../utils/hooks/useScreen";
import {TutorRequest} from "../../../requests";
import {EllipsisOutlined} from "@ant-design/icons";

interface Course {
    id: number;
    categories: string[];
    course_type: string;
    course_name: string;
    title: string[];
    price: number;
    student_count: number;
    date_created: string;
    brief: string;
    content: string;
    status: string;
    number_of_modules: number;
}

const Courses: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [editForm] = Form.useForm();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletingCourse, setDeletingCourse] = useState<Course | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const nav = useNavigate();
    const {isMobile} = useScreenSize();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch courses
                const courseResponse: any = await TutorRequest.fetchMyCourses();
                if (courseResponse) {
                    const formattedCourses = courseResponse.courses.map((course: any) => ({
                        key: course.id,
                        ...course,
                        more: (
                            <Dropdown menu={{items: getDropdownItems(course.id)}}>
                                <Space className="cursor-pointer">...</Space>
                            </Dropdown>
                        ),
                    }));
                    setCourses(formattedCourses);
                }
                
                // Fetch categories
                const categoriesResponse: any = await TutorRequest.getCategories();
                setCategories(categoriesResponse.items || []);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (course: Course) => {
        setSelectedCourse(course);
        editForm.setFieldsValue(course);
        setEditDrawerOpen(true);
    };

    const handleDelete = (course: Course) => {
        setDeletingCourse(course);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deletingCourse) return;
        try {
            await TutorRequest.deleteCourse(deletingCourse.id);
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
            await TutorRequest.updateCourse(values); // Only send values
            message.success("Course updated successfully");
            setCourses((prev) => prev.map((c) => c.id === selectedCourse?.id ? { ...c, ...values } : c));
            setEditDrawerOpen(false);
            setSelectedCourse(null);
        } catch (err: any) {
            message.error("Failed to update course");
        }
    };

    const getDropdownItems = (course: Course) => [
        {
            key: "1",
            label: (
                <div className="text-[14px] cursor-pointer" onClick={() => handleEdit(course)}>
                    Edit
                </div>
            ),
        },
        {
            key: "2",
            label: (
                <div className="text-[14px] cursor-pointer" onClick={() => handleDelete(course)}>
                    Delete
                </div>
            ),
        },
    ];

    const columns: TableColumnsType<Course> = [
        {
            title: "Course Category",
            dataIndex: "categories",
            render: (categories: string[]) => (
                <span>{Array.isArray(categories) ? categories.join(', ') : categories}</span>
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
            render: (title: string | string[]) => (
                Array.isArray(title) ? title.join(', ') : title
            ),
        },
        {
            title: "Amount (NGN)",
            dataIndex: "price",
            render: (price: number) => price.toLocaleString(),
        },
        {
            title: "No. of Students",
            dataIndex: "student_count",
        },
        {
            title: "Date Created",
            dataIndex: "date_created",
            render: (date: string) => new Date(date).toDateString(),
        },
        {
            title: "",
            dataIndex: "more",
            render: (_: any, record: Course) => (
                <Dropdown menu={{ items: getDropdownItems(record) }} trigger={["click"]}>
                    <EllipsisOutlined style={{ fontSize: 24, cursor: "pointer" }} />
                </Dropdown>
            ),
            width: 60,
            align: "center",
        },
    ];

    return (
        <Layout title="Courses" hasMargin={!isMobile}>
            <Card className="my-4 p-3 course_card">
                <header className="flex justify-between items-center">
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-[16px] inter-bold">{courses?.length} Courses</h2>

                        <Form>
                            <Form.Item>
                                <Input
                                    placeholder="Search "
                                    className="px-2 py-3 !outline-none border-[#DBDBDB] border w-[300px] rounded-[50px]"
                                />
                            </Form.Item>
                        </Form>
                        <div className="flex items-center gap-2 cursor-pointer">
                            <FilterIcon/>
                            <p className="text-[#808080] text-[14px] inter-normal">Filter</p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            label="Export"
                            className="text-[#808080] p-3 bg-transparent border-[#808080] border rounded-[5px]"
                        />
                        <Button
                            label="Upload Course"
                            onclick={() => nav(URL.CREATE_COURSE)}
                            className="text-[#fff] p-3 bg-[#581A57]  border rounded-[5px]"
                        />
                    </div>
                </header>

                <Table
                    className="mt-[20px]"
                    columns={columns}
                    data={courses}
                    loading={loading}
                    type={"selection"}
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
                            <Select
                                placeholder="Select Categories"
                                mode="multiple"
                            >
                                {categories.map((category: any) => (
                                    <Select.Option key={category.id} value={category.id}>
                                        {category.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Course Name" name="course_name">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Course Type" name="course_type">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Course Title" name="title">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Brief" name="brief">
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item label="Amount (NGN)" name="price">
                            <Input type="number" />
                        </Form.Item>
                        <Button label="Save" htmlType="submit" className="bg-[#581A57] text-white mt-2" />
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