import React from "react";
import { Navbar } from "../components";

const ComingSoon: React.FC = () => {
	return (
		<div className="bg-gray-100  ">
			<div className="absolute w-screen">
				<Navbar />
			</div>
			<div className="flex justify-center items-center h-screen ">
				<h1 className="text-4xl font-bold text-[#581A57">Coming Soon</h1>
			</div>
		</div>
	);
};

export default ComingSoon;
