import { Form, Input } from "antd";
import React from "react";
import { Button, Modal } from "../../../components";

export const WalletModal: React.FC<any> = ({
	onClose,
	handleSubmit,
	btnLoading,
	type,
}) => {
	return (
		<Modal
			isOpen={!!type}
			onClose={onClose}
			className="card-modal"
			title={
				type === "top_up" ? "Top up your wallet" : "Withdraw from your wallet"
			}
		>
			<Form layout="vertical">
				<Form.Item label="Amount">
					<Input name="course" placeholder="Enter Amount" />
				</Form.Item>
			</Form>
			<div style={{ marginTop: "20px", textAlign: "right" }}>
				<Button
					label={type === "top_up" ? "Top up" : "Withdraw "}
					loading={btnLoading}
					onclick={handleSubmit}
					className="mr-[10px] p-[8px] w-[200px] bg-[#581A57] text-white"
				/>
			</div>
		</Modal>
	);
};
