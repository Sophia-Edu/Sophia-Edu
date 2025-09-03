import { useState, useEffect } from "react";

export const useScreenSize = () => {
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 680);
	const [isTablet, setIsTablet] = useState(window.innerWidth <= 1120);

	const handleResize = () => {
		setIsMobile(window.innerWidth <= 680);
		setIsTablet(window.innerWidth <= 1120);
	};

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return { isMobile, isTablet };
};
