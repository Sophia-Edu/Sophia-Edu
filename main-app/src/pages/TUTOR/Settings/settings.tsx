import React from "react";
import Layout from "../../DashboardLayout";
import { Button, Form, Input } from "antd";
import { avatar } from "../../../assets";

const Settings: React.FC = () => {
	return (
		<Layout title="Settings">
			<Form layout="vertical" className="p-4 sm:p-0">
				{/* Profile Picture */}
				<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">
								Profile Picture
							</h3>
							<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
								Edit and Change your picture
							</p>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<Form.Item className="inter-normal" name="picture">
							<div className="bg-white w-[200px] gap-8 p-[18px] h-[220px] rounded-[10px] justify-center items-center flex flex-col">
								<img src={avatar} alt="..." width={70} />
								<p className="cursor-pointer text-[#581A57]  inter-normal text-[14px]">
									Change profile picture
								</p>
							</div>
						</Form.Item>
					</div>
				</div>
				{/* Personal Information */}
				<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">
								Personal Information
							</h3>
							<p className="text-[#666666] text-[16px] w-full lg:w-[72%]">
								Edit your biodata
							</p>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<Form.Item
							label="Full Name"
							className="inter-normal"
							name="full_name"
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
					</div>
				</div>

				{/* Password INfo */}
				<div className="flex flex-col sm:flex-row gap-2 my-[28px]">
					<div className="w-full sm:w-1/2">
						<div>
							<h3 className="mb-[10px] text-[24px] font-semibold">
								Reset Password
							</h3>
						</div>
					</div>
					<div className="w-full sm:w-1/2">
						<Form.Item
							label="Current Password"
							className="inter-normal"
							name="current_password"
						>
							<Input
								placeholder="*************"
								type="password"
								className="p-2"
							/>
						</Form.Item>

						<Form.Item
							label="New Password"
							className="inter-normal"
							name="new_password"
						>
							<Input type="password" className="p-2" />
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
							className="my-[15px] p-[20px] text-white bg-[#581A57]"
						>
							Click to reset password
						</Button>
					</div>
				</div>
			</Form>
		</Layout>
	);
};

export default Settings;
