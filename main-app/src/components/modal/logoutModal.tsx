import { useState } from "react";
import { Button } from "..";
import { clearAllCookies } from "../../utils/helperFunction";
import { useAlert, useAuth, useModal } from "../../store";

const LogoutModal = () => {
	const { toggleModal } = useModal();
	const { onLogout } = useAuth();
	const { onSuccess, onFailure } = useAlert();
	const [loading, setLoading] = useState(false);
	const handleLogout = () => {
		setLoading(true);
		try {
			onLogout();
			toggleModal();
			onSuccess("Logged out.");
			clearAllCookies();
		} catch (error: any) {
			onFailure(error?.message);
		}
	};

	return (
		<div className="">
			{/* Blurred background */}

			<h2 className="font-medium my-4 text-2xl">Log out from Sophia?</h2>
			<div className="flex gap-3 w-full">
				<Button
					label="Yes, Log out"
					className="bg-[#f00] text-[#fff]"
					onclick={handleLogout}
					loading={loading}
					disabled={loading}
				/>
				<Button
					label="No, Cancel"
					className="!border-0 text-[#0d4385] !outline-none"
					onclick={toggleModal}
				/>
			</div>
		</div>
	);
};

export default LogoutModal;
