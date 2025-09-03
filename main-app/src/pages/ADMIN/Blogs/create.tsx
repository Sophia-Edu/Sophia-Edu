import React, { useState, useEffect } from "react";
import Layout from "../../DashboardLayout";
import {
	Button,
	Form,
	Input,
	Upload as AntDUpload,
	UploadProps,
	message,
	Select,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { UploadIcon } from "../../../assets";
import adminRequests from "../../../requests/admin.request";
import { uploadImageToCloudinary } from "../../../utils/helperFunction";
import { RcFile } from "antd/es/upload";
import { URL } from "../../../utils/constants";

const CreateBlogPage: React.FC = () => {
	const [form] = Form.useForm();
	const [_, setModuleNumber] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [imgLoading, setImgLoading] = useState<boolean>(true);
	const nav = useNavigate();
	const [uploadedImageUrl, setUploadedImageUrl] = useState<any>(null); // Track uploaded image
	useEffect(() => {
		const numberOfModules = form.getFieldValue("number_of_module");
		setModuleNumber(numberOfModules || 1);
	}, [form]);

	const handleValuesChange = () => {
		const numberOfModules = form.getFieldValue("number_of_module");
		setModuleNumber(numberOfModules || 1);
	};
	const { Dragger } = AntDUpload;

	const props: UploadProps = {
		name: "file",
		multiple: false, // Only upload one image at a time
		maxCount: 1,
		accept: "image/png, image/jpeg, image/jpg",
		beforeUpload: (file: any) => {
			const isImage = file.type === "image/jpeg" || file.type === "image/png";
			if (!isImage) {
				message.error("You can only upload PNG or JPEG files!");
				return;
			}
			return isImage; // Return false to prevent upload if it's not an image
		},
		customRequest: async ({ file, onSuccess, onError }) => {
			try {
				// Cast the file to RcFile to access properties like name
				const rcFile = file as RcFile;

				// Check if file size exceeds 5MB (5 * 1024 * 1024 = 5242880 bytes)
				const isFileSizeValid = rcFile.size / 1024 / 1024 <= 5;

				if (!isFileSizeValid) {
					// Show error message if file exceeds 5MB
					message.error("File size exceeds 5MB. Please upload a smaller file.");

					// Create an error object to pass to onError
					const error = new Error("File size exceeds 5MB.");
					onError?.(error as any); // Explicitly cast as UploadRequestError
					return;
				}

				const imageUrl = await uploadImageToCloudinary(rcFile); // Upload to Cloudinary
				setUploadedImageUrl(imageUrl); // Store the uploaded image URL
				onSuccess?.("Upload successful");
				message.success(`${rcFile.name} uploaded successfully`); // Access the name property safely
			} catch (error: any) {
				onError?.(error);
				message.error("Image upload failed");
			} finally {
				setImgLoading(false);
			}
		},
		onDrop(e) {
			console.log("Dropped files", e.dataTransfer.files);
		},
	};
	const handleSubmit = async (value: any) => {
		setLoading(true);
		const { featured_image, ...rest } = value;
		const payload = {
			...rest,
			featured_image: uploadedImageUrl,
		};
		try {
			const res: any = await adminRequests.createBlog(payload);
			message.success(res.message);
			form.resetFields();
			nav(URL.ADMIN_BLOGS);
		} catch (error: any) {
			message.error(error.message);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Layout
			title={
				<>
					<ArrowLeftOutlined /> <span>Blog</span>
				</>
			}
			onclick={() => nav(-1)}
			isAdmin
		>
			{/* Personal information secion */}
			<div className="flex flex-col sm:flex-row gap-2 my-[28px] items-start">
				<div className="w-full sm:w-1/2">
					<div>
						<h3 className="mb-[10px] text-[24px] font-semibold">
							Create a Post
						</h3>
						<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
							You can create your blog post here
						</p>
					</div>
				</div>
				<div className="w-full sm:w-1/2">
					<Form
						layout="vertical"
						form={form}
						onValuesChange={handleValuesChange}
						initialValues={{}}
						onFinish={handleSubmit}
					>
						<Form.Item
							label="Heading"
							className="inter-normal"
							name={"title"}
							required
							rules={[{ required: true, message: "Heading is required" }]}
						>
							<Input placeholder="Lorem ipsum..." className="p-2" />
						</Form.Item>
						<Form.Item
							label="Subheading"
							className="inter-normal"
							required
							rules={[{ required: true, message: "Subheading is required" }]}
							name={"subheading"}
						>
							<Input placeholder="Lorem ipsum..." className="p-2" />
						</Form.Item>
						<Form.Item
							label="Category"
							className="inter-normal"
							name={"category"}
							rules={[{ required: true, message: "Category is required" }]}
							required
						>
							<Select
								placeholder="Select Catgeory"
								className="!p-[20px] inter-bold bg-[#fff] !text-black !outline-none !hover:border-none !border-none rounded-[6px]"
							>
								<Select.Option value="Technology">Technology</Select.Option>
								<Select.Option value="Business">Business</Select.Option>
								<Select.Option value="Health">Health & Fitness</Select.Option>
								<Select.Option value="Science & Natur">
									Science & Nature
								</Select.Option>
								<Select.Option value="Lifestyle">Lifestyle</Select.Option>
								<Select.Option value="Sports">Sports</Select.Option>
								<Select.Option value="World">World</Select.Option>
								<Select.Option value="Education">Education</Select.Option>
								<Select.Option value="Culture">Culture</Select.Option>
								<Select.Option value="Arts">Arts</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item
							label="Body"
							className="inter-normal"
							name={"content"}
							required
							rules={[{ required: true, message: "Body content is required" }]}
						>
							<Input.TextArea placeholder="message" className="p-2" />
						</Form.Item>
						<Form.Item
							label="Upload Image"
							name={"featured_image"}
							required
							rules={[{ required: true, message: "Image is required" }]}
						>
							<Dragger {...props}>
								<p className="ant-upload-drag-icon flex justify-center">
									<UploadIcon />
								</p>
								<p className="ant-upload-hint">
									(max file size: 5mb - *png,*jpeg)
								</p>
							</Dragger>
						</Form.Item>
						<Form.Item
							label="Mins of read"
							className="inter-normal"
							name={"minutes_read"}
							required
							rules={[
								{ required: true, message: "Minutes of read is required" },
							]}
						>
							<Input placeholder="2" className="p-2" type="number" />
						</Form.Item>
						{/* <Form.Item
							label="Name of author"
							className="inter-normal"
							name={"name_of_author"}
						>
							<Input readOnly placeholder="Aluko Folajimi" className="p-2" />
						</Form.Item> */}
						<Button
							htmlType="submit"
							block
							loading={loading}
							disabled={loading || imgLoading}
							className="my-[15px] p-[20px] text-white bg-[#581A57]"
						>
							Publish
						</Button>
					</Form>
				</div>
			</div>
		</Layout>
	);
};

export default CreateBlogPage;
