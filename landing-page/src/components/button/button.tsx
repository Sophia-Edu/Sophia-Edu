import { Button as AntdButton } from "antd"; // Rename imported Button to avoid naming conflict
import { ReactNode } from "react";
import { APPCONSTANTS } from "../../constants";
import "./button.styles.scss";

interface IButtonProps {
	width?: string | number;
	height?: string | number;
	borderRadius?: string;
	children?: ReactNode;
	background?: string;
	className?: string;
	color?: string;
}

const CustomButton: React.FC<IButtonProps> = ({
	width,
	height,
	borderRadius,
	background,
	color,
	className,
	children,
}) => {
	return (
		<AntdButton
			className={["button playfair-display-normal", className].join(" ")}
			style={{ width, minHeight: height, borderRadius, background, color }} // Apply styles to the AntdButton
		>
			{children}
		</AntdButton>
	);
};

CustomButton.defaultProps = {
	width: "100px",
	height: "40px",
	borderRadius: "5px",
	background: APPCONSTANTS.APP_DARK_PURPLE,
	color: "#fff",
};

export default CustomButton; // Export the component
