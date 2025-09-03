import React from "react";
import { Footer, Navbar } from "../../components";
import {
	facebookIcon,
	instaIcon,
	locationIcon,
	mailIcon,
	womanCall,
	xIcon,
	youtubeIcon,
} from "../../assets";
import "./Contactpage.styles.scss";
import { Col, Row } from "antd";

const Contactpage: React.FC<any> = () => {
	return (
		<div className="contact">
			<div className="contain">
				<Navbar />
				<h2 style={{ textAlign: "center" }}>Contact Us</h2>
				<div className="img_contain">
					<img src={womanCall} alt="" />
				</div>
			</div>

			<Row style={{ background: "#fff" }} className="bottom">
				<Col xs={{ span: 24 }} lg={{ span: 12 }}>
					<h2 className="inter-bold">Find Us</h2>
					<div className="flex">
						<img src={locationIcon} alt="icon" />
						<p className="inter-normal">
							Mailing Address: George street Liverpool, NSW 2170, Australia.{" "}
						</p>
					</div>
					<div className="flex">
						<img src={mailIcon} alt="icon" />
						<p className="inter-normal">Info@sophiaeducation.com</p>
					</div>
				</Col>
				<Col xs={{ span: 24 }} lg={{ span: 12 }}>
					<h2 className="inter-bold">Socials</h2>
					<div className="flex">
						<img src={facebookIcon} alt="icon" />
						<p className="inter-normal">shopiaEducation</p>
					</div>
					<div className="flex">
						<img src={instaIcon} alt="icon" />
						<p className="inter-normal">shopiaEducation</p>
					</div>
					<div className="flex">
						<img src={xIcon} alt="icon" />
						<p className="inter-normal">shopiaEducation</p>
					</div>
					<div className="flex">
						<img src={youtubeIcon} alt="icon" />
						<p className="inter-normal">shopiaEducation</p>
					</div>
					<div className="flex">
						<img src={mailIcon} alt="icon" />
						<p className="inter-normal">Info@sophiaeducation.com</p>
					</div>
				</Col>
			</Row>
			<Footer />
		</div>
	);
};

export default Contactpage;
