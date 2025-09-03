import React, { useState } from "react";
import Layout from "../../DashboardLayout";
import { Button, Form, FormProps, Input } from "antd";
import { AdminRequest } from "../../../requests";
import { useAlert } from "../../../store";
import { useNavigate } from "react-router-dom";
import { URL } from "../../../utils/constants";

type FieldType = {
	name?: string;
};

const CreateCategoryPage: React.FC = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const { onFailure: AlertFailure, onSuccess } = useAlert();
	const nav = useNavigate();

	const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
		setLoading(true);
		try {
			await AdminRequest.createCategory({ name: values.name });
			onSuccess("Category created successfully!");
			form.resetFields();
			nav(URL.ADMIN_CATEGORIES);
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
		<Layout title="Create Category" isAdmin>
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
								Category Information
							</h3>
							<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
								Create a new category for courses
							</p>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<Form.Item 
							label="Category Name" 
							name="name" 
							className="inter-normal" 
							rules={[
								{ required: true, message: 'Please enter category name' },
								{ min: 2, message: 'Category name must be at least 2 characters' },
								{ max: 50, message: 'Category name cannot exceed 50 characters' }
							]}
						>
							<Input placeholder="Enter category name" className="p-2" />
						</Form.Item>

						<Button
							block
							loading={loading}
							htmlType="submit"
							disabled={loading}
							className="my-[15px] p-[20px] text-white bg-[#581A57]"
						>
							Create Category
						</Button>
					</div>
				</div>
			</Form>
		</Layout>
	);
};

export default CreateCategoryPage;