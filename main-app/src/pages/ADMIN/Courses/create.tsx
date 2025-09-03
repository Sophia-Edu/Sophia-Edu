import React, { useState, useEffect } from "react";
import Layout from "../../DashboardLayout";
import { Button, Form, FormProps, Input, Select, Modal as AntModal } from "antd";
import { AdminRequest } from "../../../requests";
import { useAlert } from "../../../store";
import { useNavigate } from "react-router-dom";

type FieldType = {
	course_name?: string;
	course_type?: string;
	price?: string;
	category_ids?: number[];
	instructor_id?: number;
	content?: string;
	number_of_modules?: number;
	brief?: string;
	additional_resources?: string;
};

interface Category {
	id: number;
	name: string;
}

const CreateCoursePage: React.FC = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const { onFailure: AlertFailure, onSuccess } = useAlert();
	const nav = useNavigate();
	const [categories, setCategories] = useState<Category[]>([]);
	const [courseTitles, setCourseTitles] = useState<string[]>(['']); // Array to store multiple course titles
	const [instructors, setInstructors] = useState<any[]>([]);
	const [isAddCategoryModalVisible, setIsAddCategoryModalVisible] = useState(false);
	const [newCategoryName, setNewCategoryName] = useState('');
	const [addingCategory, setAddingCategory] = useState(false);
	
	// Fetch categories and instructors when component mounts
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Fetch categories
				const categoriesResponse:any = await AdminRequest.getCategories();
				setCategories(categoriesResponse.items || []);
				
				// Fetch instructors
				const instructorsResponse = await AdminRequest.getInstructors();
				setInstructors(instructorsResponse.data || []);
			} catch (error: any) {
				console.error("Error fetching data:", error);
				AlertFailure(error.message);
			}
		};
		
		fetchData();
	}, []);

	const handleAddCategory = async () => {
		if (!newCategoryName.trim()) {
			AlertFailure("Category name is required");
			return;
		}

		setAddingCategory(true);
		try {
			const response:any = await AdminRequest.createCategory({ name: newCategoryName.trim() });
			setCategories(prev => [...prev, {id: response.id, name: newCategoryName.trim() }]);
			setNewCategoryName('');
			setIsAddCategoryModalVisible(false);
			onSuccess("Category created successfully!");
		} catch (error: any) {
			AlertFailure(error.message || "Failed to create category");
		} finally {
			setAddingCategory(false);
		}
	};
	
	const getCourseData = (values: any) => {
		const { course_name, course_type, price, category_ids, instructor_id, content, number_of_modules, module_ids, brief, additional_resources } = values;
		
		// Convert category_ids to category names if needed
		const selectedCategories = category_ids?.map((id: number) => {
			const category = categories.find(cat => cat.id === id);
			return category?.name || "";
		}).filter(Boolean) || [];
		
		return {
			titles: courseTitles.filter(title => title.trim()), // Array of titles
			course_name,
			course_type,
			content: content || "",
			price: price ? parseFloat(price) : null,
			categories: selectedCategories, // Use category names instead of IDs
			category_ids: category_ids || [], // Keep this for backward compatibility
			instructor_id: instructor_id ? parseInt(instructor_id) : undefined,
			module_ids: module_ids || [], // Use selected module_ids or empty array
			number_of_modules: number_of_modules ? parseInt(number_of_modules) : 0,
			brief: brief || "",
			additional_resources: additional_resources || ""
		};
	}

	const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
		let courseData = getCourseData(values);

		setLoading(true);
		try {
			await AdminRequest.createCourse(courseData);
			onSuccess("Course created successfully!");
			form.resetFields();
			nav("/admin/courses");
		} catch (error: any) {
			console.error("Creation error:", error);
			AlertFailure(error.message);
		} finally {
			setLoading(false);
		}
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo: any
	) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<Layout title="Create Course" isAdmin>
			<Form
				layout="vertical"
				form={form}
				onFinish={onFinish}
				initialValues={{}}
				onFinishFailed={onFinishFailed}
				className="p-4 sm:p-0"
			>
				<div className="flex flex-col sm:flex-row gap-2 my-[28px] items-start">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">
								Course Information
							</h3>
							<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
								This section contains course details
							</p>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<div className="flex items-start gap-2">
							<Form.Item 
								label="Course Categories" 
								name="category_ids" 
								className="inter-normal flex-1" 
								rules={[{ required: true, message: 'Please select at least one category' }]}
							>
								<Select
									placeholder="Select Categories"
									className="!px-[20px] py-2 inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
									loading={loading}
									mode="multiple"
								>
									{categories.map((category) => (
										<Select.Option key={category?.id} value={category?.id}>
											{category.name}
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Button
								type="link"
								onClick={() => setIsAddCategoryModalVisible(true)}
								className="mt-8 text-[#581A57]"
							>
								+ Add Category
							</Button>
						</div>
						
						<Form.Item label="Course Type" name="course_type" className="inter-normal">
							<Input placeholder="Enter course type" className="p-2" />
						</Form.Item>
						
						<Form.Item label="Course Name" name="course_name" className="inter-normal" rules={[{ required: true, message: 'Please enter course name' }]}>
							<Input placeholder="Enter course name" className="p-2" />
						</Form.Item>
						
						<Form.Item label="Course Title" className="mb-0">
							<div className="flex justify-between items-center">
								<span className="text-[#666666]">Add Course Titles</span>
								<Button
									className="text-[#581A57]"
									type="link"
									onClick={() => setCourseTitles([...courseTitles, ''])}
								>
									+ Add Title
								</Button>
							</div>
						</Form.Item>
						{courseTitles.map((title, index) => (
							<Form.Item
								key={index}
								className="inter-normal mb-2"
							>
								<div className="flex items-center">
									<Input
										placeholder={`Enter title ${index + 1}`}
										className="p-2"
										value={title}
										onChange={(e) => {
											const newTitles = [...courseTitles];
											newTitles[index] = e.target.value;
											setCourseTitles(newTitles);
										}}
									/>
									{courseTitles.length > 1 && (
										<Button
											className="ml-2 text-red-500"
											type="link"
											onClick={() => {
												const newTitles = courseTitles.filter((_, i) => i !== index);
												setCourseTitles(newTitles);
											}}
										>
											Remove
										</Button>
									)}
								</div>
							</Form.Item>
						))}
						
						<Form.Item label="Course Content" name="content" className="inter-normal" rules={[{ required: true, message: 'Please enter course content' }]}>
							<Input.TextArea placeholder="Enter course content" className="p-2" rows={6} />
						</Form.Item>
						
						<Form.Item label="Brief Description" name="brief" className="inter-normal">
							<Input.TextArea placeholder="Enter a brief description" className="p-2" />
						</Form.Item>
						
						<Form.Item label="Instructor" name="instructor_id" className="inter-normal">
							<Select
								placeholder="Select an Instructor (Optional)"
								className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
								allowClear
								loading={instructors.length === 0}
							>
								<Select.Option value={null}>None (Admin as author)</Select.Option>
								{instructors.map((instructor) => (
									<Select.Option key={instructor.id} value={instructor.id}>
										{instructor.name || instructor.email || `Instructor #${instructor.id}`}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						
						<Form.Item label="Amount" className="inter-normal" name="price" rules={[{ required: true, message: 'Please enter price' }]}>
							<Input className="p-2" type="number" placeholder="Enter amount"/>
						</Form.Item>

						<Form.Item label="Number of Modules" className="inter-normal" name="number_of_modules">
							<Select
								placeholder="Select Number of Modules"
								className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
							>
								{[1, 2, 3, 4, 5].map((count) => (
									<Select.Option key={count} value={count}>
										{count}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						
						<Form.Item label="Existing Module IDs (Optional)" className="inter-normal" name="module_ids">
							<Select
								placeholder="Select Existing Modules"
								className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
								mode="multiple"
							>
								{[1, 2, 3, 4, 5].map((id) => (
									<Select.Option key={id} value={id}>
										Module #{id}
									</Select.Option>
								))}
							</Select>
						</Form.Item>
						
						<Form.Item label="Additional Resources" name="additional_resources" className="inter-normal">
							<Input.TextArea placeholder="Enter additional resources" className="p-2" />
						</Form.Item>

						<Button
							block
							loading={loading}
							htmlType="submit"
							disabled={loading}
							className="my-[15px] p-[20px] text-white bg-[#581A57]"
						>
							Create Course
						</Button>
					</div>
				</div>
			</Form>

			<AntModal
				title="Add New Category"
				open={isAddCategoryModalVisible}
				onOk={handleAddCategory}
				onCancel={() => {
					setIsAddCategoryModalVisible(false);
					setNewCategoryName('');
				}}
				okText="Create"
				confirmLoading={addingCategory}
			>
				<Form.Item
					label="Category Name"
					required
					validateStatus={newCategoryName.trim() ? 'success' : 'error'}
					help={!newCategoryName.trim() && 'Please enter category name'}
				>
					<Input
						value={newCategoryName}
						onChange={(e) => setNewCategoryName(e.target.value)}
						placeholder="Enter category name"
						className="p-2"
					/>
				</Form.Item>
			</AntModal>
		</Layout>
	);
};

export default CreateCoursePage;
