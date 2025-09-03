import React, { useEffect, useState } from "react";
import { BackTop } from "antd";
import { UpOutlined } from "@ant-design/icons";

const ScrollToTopButton: React.FC = () => {
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 300) {
				setShowButton(true);
			} else {
				setShowButton(false);
			}
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div>
			{showButton && (
				<BackTop>
					<div className="bg-[#fff] w-[44px] text-[#581A57] p-3 border-white border rounded-md shadow-lg hover:bg-[#fff] transition-colors duration-300">
						<UpOutlined className="text-lg font-bold" />
					</div>
				</BackTop>
			)}
		</div>
	);
};

export default ScrollToTopButton;
