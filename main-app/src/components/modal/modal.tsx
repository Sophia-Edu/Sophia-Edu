import React from "react";
import { Modal as AntModal } from "antd";

const CustomModal: React.FC<any> = ({
	isOpen,
	onClose,
	className,
	title,
	footer = null,
	children,
	confirmLoading,
}) => {
	return (
		<>
			{/* Blurred background applied to the area outside the modal */}
			{isOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"></div>
			)}

			<AntModal
				title={title}
				open={isOpen}
				confirmLoading={confirmLoading}
				centered
				className={className}
				footer={footer} // Removed default footer
				onCancel={onClose}
				zIndex={50} // Ensures the modal stays above the blur background
			>
				{children}
			</AntModal>
		</>
	);
};

export default CustomModal;
