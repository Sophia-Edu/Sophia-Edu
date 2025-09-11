import React, { useEffect, useState, useRef } from "react";
import Layout from "../../DashboardLayout";
import { Button, Form, Input, message } from "antd";
import { avatar } from "../../../assets";
import TutorRequest from "../../../requests/tutor.request";
import { ClientRequest } from "../../../requests";
import { uploadFileToCloudinary } from "../../../utils/helperFunction";
import { useAlert } from "../../../store";
import { setInstructorId } from "../../../utils/storage";

const Settings: React.FC = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const { onSuccess, onFailure } = useAlert();

	const loadProfile = async () => {
		try {
			setLoading(true);
			// Get instructor profile by ID 1 as mentioned in the user's example
			const resp: any = await TutorRequest.getInstructorById(1);
			console.log('Instructor profile response:', resp);
			
			// Normalize common response shapes: array, { items: [...] }, { data: {...} } or direct object
			let data: any = resp;
			if (Array.isArray(resp)) {
				data = resp[0];
			} else if (resp && typeof resp === "object") {
				if (resp.data && (typeof resp.data === "object" || Array.isArray(resp.data))) {
					data = Array.isArray(resp.data) ? resp.data[0] : resp.data;
				} else if (Array.isArray(resp.items) && resp.items.length) {
					data = resp.items[0];
				}
			}

			// fallback: try /profile/me if nothing useful
			if (!data || Object.keys(data).length === 0) {
				try {
					const me: any = await ClientRequest.getMe();
					if (me && Object.keys(me).length) data = me;
				} catch (e) {
					// ignore
				}
			}
			
			console.log('Processed instructor data:', data);
			
			if (data) {
                // Cache numeric instructor id for header use
                const possibleId = data.id ?? data.user_id ?? data.uid ?? data.ID;
                if (possibleId != null && /^\d+$/.test(String(possibleId))) {
                    setInstructorId(possibleId);
                }
                // Clean the profile_image string by removing any extra spaces or quotes
				let profileImage = data.profile_image || "";
				if (typeof profileImage === 'string') {
					profileImage = profileImage.trim().replace(/['"`]/g, '');
				}
				
				form.setFieldsValue({
					full_name: data.full_name || data.name || "",
					email: data.email || "",
					phone: data.phone || data.mobile || "",
					profile_image: profileImage,
					bio: data.bio || "",
					expertise: data.expertise || "",
				});
				setProfilePreview(profileImage);
				console.log('Set profile preview to:', profileImage);
			}
		} catch (e: any) {
			// no-op: keep UI usable
			console.warn("Failed to load instructor profile", e?.message || e);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [profilePreview, setProfilePreview] = useState<string>("");

	const onSelectImageClick = () => {
		fileInputRef.current?.click();
	};

	const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			setLoading(true);
			// Upload the file to Cloudinary first
			const secureUrl = await uploadFileToCloudinary(file, 'image');
			// Persist to instructor profile using instructor endpoint
			await TutorRequest.updateInstructorProfile({ profile_image: secureUrl });
			form.setFieldsValue({ profile_image: secureUrl });
			setProfilePreview(secureUrl);
			message.success("Image uploaded");
		} catch (err: any) {
			message.error(err?.message || "Image upload failed");
		} finally {
			setLoading(false);
		}
	};

	const onFinish = async (values: any) => {
		try {
			setLoading(true);
			const response = await TutorRequest.updateInstructorProfile(values);
			console.log('Profile update response:', response);
			onSuccess("Profile updated successfully");
			
			// Reload the profile to show updated information
			await loadProfile();
		} catch (err: any) {
			console.error('Profile update error:', err);
			onFailure(err?.message || "Failed to update profile");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout title="Settings">
			<Form layout="vertical" form={form} onFinish={onFinish} className="p-4 sm:p-0">
				{/* Profile Picture */}
				<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">Profile Picture</h3>
							<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">Edit and Change your picture</p>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<Form.Item className="inter-normal" name="profile_image">
							<div className="bg-white w-[200px] gap-8 p-[18px] h-[220px] rounded-[10px] justify-center items-center flex flex-col">
								{profilePreview ? (
									<img 
										src={profilePreview} 
										alt="Profile" 
										width={70} 
										onError={(e) => {
											console.error('Image failed to load:', profilePreview);
											(e.target as HTMLImageElement).src = avatar;
										}}
									/>
								) : (
									<img src={avatar} alt="Default Avatar" width={70} />
								)}
								<button type="button" onClick={onSelectImageClick} className="cursor-pointer text-[#581A57] inter-normal text-[14px] bg-transparent border-none">
									Change profile picture
								</button>
								<input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
							</div>
						</Form.Item>
					</div>
				</div>
				{/* Personal Information */}
				<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">Personal Information</h3>
							<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">Edit your biodata</p>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<Form.Item label="Full Name" className="inter-normal" name="full_name">
							<Input placeholder="Aluko Folajimi" className="p-2" />
						</Form.Item>
						<Form.Item label="Email Address" className="inter-normal" name="email">
							<Input placeholder="Folajimi123@gmail.com" className="p-2" />
						</Form.Item>
						<Form.Item label="Phone Number" className="inter-normal" name="phone">
							<Input placeholder="+23471734492474" className="p-2" />
						</Form.Item>
						<Form.Item label="Bio" className="inter-normal" name="bio">
							<Input.TextArea rows={3} placeholder="Short bio" />
						</Form.Item>
						<Form.Item label="Expertise" className="inter-normal" name="expertise">
							<Input placeholder="Data Science, Machine Learning" className="p-2" />
						</Form.Item>
					</div>
				</div>

				{/* Password Info */}
				<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">Reset Password</h3>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<Form.Item label="Current Password" className="inter-normal" name="current_password">
							<Input placeholder="*************" type="password" className="p-2" />
						</Form.Item>
						<Form.Item label="New Password" className="inter-normal" name="new_password">
							<Input type="password" className="p-2" />
						</Form.Item>
						<Form.Item label="Confirm Password" className="inter-normal" name="confirm_password">
							<Input type="password" className="p-2" />
						</Form.Item>
					</div>
				</div>
				<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
					<div className="w-full sm:w-1/2 hidden sm:block" style={{ visibility: "hidden" }}></div>
					<div className="w-full sm:w-1/2">
						<Button htmlType="submit" block loading={loading} className="my-[15px] p-[20px] text-white bg-[#581A57]">Save profile</Button>
					</div>
				</div>
			</Form>
		</Layout>
	);
};

export default Settings;
