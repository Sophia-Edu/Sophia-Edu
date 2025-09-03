import React, { useState } from "react";
import { Avatar, Card, Form, Input, Progress } from "antd";
import { Button, Modal } from "..";

const { Meta } = Card;

interface ICardProps {
	name: string;
	description: string;
	image: string;
	subject: string;
	isSubscribed?: boolean;
	avatar: string;
	price: string;
	buttonText: string;
	buttonLink: string;
	onClick?: any;
	buttonColor: string;
	courseName?: string;
	studentCount?: number;
	modules?: number;
	authorType?: string;
	status?: string;
}

const Container: React.FC<ICardProps> = ({
	name,
	image,
	price,
	avatar,
	onClick,
	subject,
	description,
	buttonText,
	buttonColor,
	isSubscribed,
	courseName,
	studentCount,
	modules,
	authorType,
	status,
}) => {
	const [open, setOpen] = useState(false);
	const [buttonLoading, setButtonLoading] = useState({
		firstBtn: false,
		secondBtn: false,
	});

	const handleTopUpWallet = () => {
		setButtonLoading({
			firstBtn: !buttonLoading.firstBtn,
			secondBtn: buttonLoading.secondBtn,
		});
		
		// Navigate to course details page after a short delay
		setTimeout(() => {
			setButtonLoading({ firstBtn: false, secondBtn: buttonLoading.secondBtn });
			setOpen(false);
			
			// Call the onClick function to navigate to course details
			if (onClick) {
				onClick();
			}
		}, 1000); // Reduced delay for better UX
	};
	const handlePayWithWallet = () => {
		setButtonLoading({
			firstBtn: buttonLoading.firstBtn,
			secondBtn: !buttonLoading.secondBtn,
		});
		setTimeout(() => {
			setButtonLoading({ firstBtn: buttonLoading.firstBtn, secondBtn: false });
			setOpen(false);
		}, 2000);
	};
	return (
		<Card
			hoverable
			className="w-[100%] p-3 bg-white course-card"
			onClick={onClick}
			cover={
				<div className="relative">
					{/* Background Image with Transparency */}
					<img
						alt={courseName || "Course image"}
						src={image}
						className="h-[200px] w-full object-cover rounded-md"
					/>
					{/* Black Overlay */}
					<div className="absolute inset-0 bg-black opacity-50 rounded-md"></div>
					
					{/* Status Badge */}
					{status && (
						<div className="absolute top-2 right-2">
							<span className={`px-2 py-1 rounded text-xs font-semibold ${
								status === 'published' ? 'bg-green-500 text-white' : 
								status === 'draft' ? 'bg-yellow-500 text-white' :
								'bg-gray-500 text-white'
							}`}>
								{status.charAt(0).toUpperCase() + status.slice(1)}
							</span>
						</div>
					)}
					
					{/* Course Stats */}
					<div className="absolute top-2 left-2 flex flex-col gap-1">
						{studentCount !== undefined && (
							<div className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
								👥 {studentCount} students
							</div>
						)}
						{modules !== undefined && modules > 0 && (
							<div className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs font-medium">
								📚 {modules} modules
							</div>
						)}
					</div>
					
					{/* Centered Course Subject */}
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-white font-bold text-lg font-inter text-center px-4">
							{subject}
						</span>
					</div>
					
					{/* Avatar */}
					<Avatar
						size={64}
						src={avatar}
						className="mb-3 absolute border-4 border-solid border-white left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
					/>
				</div>
			}
		>
			{/* Content */}
			<div className="card-content">
				{/* Course Title */}
				{courseName && (
					<h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
						{courseName}
					</h3>
				)}
				
				{/* Instructor Info */}
				<Meta
					title={
						<div className="flex items-center gap-2">
							<span className="text-sm font-medium">{name}</span>
							{authorType && (
								<span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
									{authorType === 'admin' ? 'Admin' : 'Instructor'}
								</span>
							)}
						</div>
					}
					description={
						<span className="text-gray-500 text-xs">
							{authorType === 'admin' ? 'System Administrator' : 'Course Instructor'}
						</span>
					}
					className="text-center !mt-[10px] font-inter font-medium"
				/>
				
				{/* Course Description */}
				<div className="mt-3">
					<p className="text-gray-600 text-sm line-clamp-2 text-center">
						{description}
					</p>
				</div>
			</div>
			{isSubscribed ? (
				<>
					<Progress
						showInfo={false}
						strokeColor="#581A57"
						className="py-[12px]"
						percent={60}
					/>
					{/* Footer */}
					<Button
						block
						label={buttonText}
						className={`bg-[${buttonColor}] text-white p-3 w-[100px] font-inter`}
					/>
				</>
			) : (
				<div 
					className="mt-[22px] flex justify-between"
					onClick={(e) => e.stopPropagation()} // Prevent card click on this section
				>
					<p className="text-[#121212] text-[18px]">
						Price <span className="text-black font-inter">{price}</span>
					</p>
					<Button
						className="bg-[#581A57] text-white p-3 w-[100px]"
						label="Subscribe"
						onclick={() => setOpen(true)}
					/>
				</div>
			)}
			<Modal
				isOpen={open}
				onClose={() => setOpen(!open)}
				className="card-modal"
				title="Proceed to Payment"
				cancelText="Top up wallet"
				cancelBtnLoading={buttonLoading.firstBtn}
				okText="Pay with wallet"
				okBtnLoading={buttonLoading.secondBtn}
				handleCancel={handleTopUpWallet}
				handleOk={handlePayWithWallet}
			>
				<Form layout="vertical">
					<Form.Item label="Course Title">
						<Input 
							name="course" 
							value={courseName || name} 
							disabled
							placeholder="Course Title" 
						/>
					</Form.Item>
					<Form.Item label="Amount">
						<Input 
							name="amount" 
							value={price}
							disabled
							placeholder="Amount" 
						/>
					</Form.Item>
					<Form.Item label="Instructor">
						<Input 
							name="instructor" 
							value={name}
							disabled
							placeholder="Instructor Name" 
						/>
					</Form.Item>
				</Form>
				<div style={{ marginTop: "20px", textAlign: "right" }}>
					<Button
						loading={buttonLoading.secondBtn === true}
						onclick={handlePayWithWallet}
						label="Pay with wallet"
						className="mr-[10px] p-[8px] bg-[#581A57] text-white"
					/>
					<Button
						onclick={handleTopUpWallet}
						loading={buttonLoading.firstBtn === true}
						label="Top up wallet"
						className="text-[#581A57] p-[8px] bg-[#E6DDE6]"
					/>
				</div>
			</Modal>
		</Card>
	);
};

export default Container;
