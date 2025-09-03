import React from "react";
import { Collapse } from "antd";
import "./accordion.styles.scss";
import { CaretRightOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

interface IAccordionProps {
	data: string[]; // Data is always an array of strings
	title: string;
	background?: string;
}

const Accordion: React.FC<IAccordionProps> = ({ data, title }) => {
	return (
		<Collapse
			className="accordion"
			accordion
			expandIcon={({ isActive }) => (
				<CaretRightOutlined
					rotate={isActive ? 90 : 0}
					style={{ float: "right" }}
				/>
			)}
			style={{ background: "#f0f0f0" }}
		>
			<Panel
				header={
					<div className="custom-title playfair-display-bold">{title}</div>
				}
				key={Math.random()} // Assuming a unique key for the panel
				style={{ background: "#f0f0f0" }}
			>
				{data.map((item, index) => (
					<React.Fragment key={index}>
						<p>{item}</p>
					</React.Fragment>
				))}
			</Panel>
		</Collapse>
	);
};

export default Accordion;
