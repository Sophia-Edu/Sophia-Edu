import React, { useState } from "react";
import Layout from "../../DashboardLayout";
import { Button, Checkbox, Form, Input, Upload, Avatar } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminRequest } from "../../../requests";
import { URL } from "../../../utils/constants";
import { useAlert } from "../../../store";
import { UploadOutlined } from "@ant-design/icons";
import { uploadImageToCloudinary } from "../../../utils/helperFunction";

const options = [
	{ label: "All", value: "All" },
	{ label: "Access to wallet", value: "Access to wallet" },
	{
		label: "Access to dashboard/overview",
		value: "Access to dashboard/overview",
	},
	{ label: "Access to overview", value: "Access to overview" },
	{ label: "Access to instructor", value: "Access to instructor" },
	{ label: "Access to courses", value: "Access to courses" },
];

const Edit: React.FC = () => {
	const [checkedValues, setCheckedValues] = useState<any[]>([]);
	const { state } = useLocation(); // Get state from the location object
	const [loading, setLoading] = useState(false);
	const [roles, _] = useState(state?.roles);
	const [profileImage, setProfileImage] = useState(
		state?.profile_image || null
	); // State for profile image
	const nav = useNavigate();
	const { onFailure: AlertFailure, onSuccess } = useAlert(); // Alert handler

	const [form] = Form.useForm(); // Form instance from Ant Design

	const handleImageChange = async (info: any) => {
		const imageUrl = await uploadImageToCloudinary(info.file);
		setProfileImage(imageUrl); // Set profile image URL
	};

	// Checkbox change handler
	const onCheckboxChange = (value: string) => {
		let updatedCheckedValues = [...checkedValues];
		if (value === "All") {
			if (updatedCheckedValues.includes("All")) {
				updatedCheckedValues = [];
			} else {
				updatedCheckedValues = options.map((option) => option.value);
			}
		} else {
			if (updatedCheckedValues.includes(value)) {
				updatedCheckedValues = updatedCheckedValues.filter(
					(item) => item !== value
				);
			} else {
				updatedCheckedValues.push(value);
			}
		}

		// Remove "All" if not all options are selected
		if (updatedCheckedValues.length !== options.length) {
			updatedCheckedValues = updatedCheckedValues.filter(
				(item) => item !== "All"
			);
		}

		// Add "All" if all options are selected
		if (updatedCheckedValues.length === options.length - 1) {
			updatedCheckedValues.push("All");
		}

		setCheckedValues(updatedCheckedValues);
	};

	const onFinish = async (values: any) => {
		setLoading(true);
		try {
			const data = {
				...values,
				username: state.username,
				fullname: state.fullname,
				roles,
				profile_image: profileImage,
			}; // Add profile_image to form values
			await AdminRequest.editAdmin(state.id, data); // API call to edit user
			onSuccess("User updated successfully!");
			nav(URL.ADMIN_SETTINGS);
		} catch (error: any) {
			console.error("Error updating user:", error);
			AlertFailure(error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout title="Edit" isAdmin>
			<Form
				form={form}
				layout="vertical"
				className="p-4 sm:p-0"
				onFinish={onFinish}
				initialValues={{
					fullname: state?.fullname,
					email: state?.email,
					phone: state?.phone,
					profile_image: profileImage,
					roles: state.roles?.map((role: any) => role.name).join(", "),
				}} // Set initial values from state
			>
				{/* User Information */}
				<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">
								User Information
							</h3>
							<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
								Edit user biodata
							</p>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<Form.Item
							label="Full Name"
							className="inter-normal"
							name="fullname"
						>
							<Input placeholder="Aluko Folajimi" className="p-2" />
						</Form.Item>
						<Form.Item
							label="Email Address"
							className="inter-normal"
							name="email"
						>
							<Input placeholder="Folajimi123@gmail.com" className="p-2" />
						</Form.Item>
						<Form.Item
							label="Phone Number"
							className="inter-normal"
							name="phone"
						>
							<Input placeholder="+23471734492474" className="p-2" />
						</Form.Item>
						{/* Profile Image Upload */}
						<Form.Item label="Profile Image" className="inter-normal">
							<Upload
								name="profile_image"
								listType="picture-card"
								showUploadList={false}
								customRequest={handleImageChange} // Custom request to handle image upload
							>
								{profileImage ? (
									<Avatar src={profileImage} size={64} /> // Preview the uploaded image as an avatar
								) : (
									<Button icon={<UploadOutlined />}>Upload Image</Button>
								)}
							</Upload>
						</Form.Item>
					</div>
				</div>

				{/* Role */}
				<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">Role</h3>
							<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
								Add/Remove User Role
							</p>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<Form.Item label="Role" className="inter-normal" name="roles">
							<Input placeholder="Enter Role name" className="p-2" />
						</Form.Item>
						<Form.Item
							label={`Role Permissions`}
							className="inter-normal"
						>
							<div
								style={{ display: "flex", flexDirection: "column", gap: "8px" }}
							>
								{options.map((option) => (
									<Checkbox
										key={option.value}
										checked={checkedValues.includes(option.value)}
										onChange={() => onCheckboxChange(option.value)}
									>
										{option.label}
									</Checkbox>
								))}
							</div>
						</Form.Item>
						<Form.Item
							label="Confirm Password"
							className="inter-normal"
							name="confirm_password"
						>
							<Input type="password" className="p-2" />
						</Form.Item>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
					<div
						className="w-full sm:w-1/2 hidden sm:block"
						style={{ visibility: "hidden" }}
					></div>
					<div className="w-full sm:w-1/2">
						<Button
							htmlType="submit"
							block
							loading={loading}
							disabled={loading}
							className="my-[15px] p-[10px] text-white bg-[#581A57]"
						>
							Update User
						</Button>
					</div>
				</div>
			</Form>
		</Layout>
	);
};

export default Edit;
