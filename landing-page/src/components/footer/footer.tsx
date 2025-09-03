import React from "react";
import { APPCONSTANTS, URL } from "../../constants";
import { Col, Row } from "antd";
import { Button } from "..";
import "./footer.styles.scss";
import { logo2 } from "../../assets";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
	return (
		<div
			className="footer"
			style={{
				background: APPCONSTANTS.APP_DARK_PURPLE,
				color: "#fff",
				minHeight: "50vh",
				width: "100%",
			}}
		>
			<Row
				justify="center"
				align="top"
				style={{ borderBottom: "1px solid #fff", marginBottom: 20 }}
			>
				<Col>
					<div style={{ textAlign: "center" }}>
						<h2 className="playfair-display-bold title">
							Get started and find your best courses
						</h2>
						<a
							href={"https://sophia-main-app.netlify.app/register"}
							target="_blank"
						>
							<Button
								color={APPCONSTANTS.APP_DARK_PURPLE}
								background="#fff"
								className="reg_btn inter-bold"
							>
								Sign Up
							</Button>
						</a>
					</div>
				</Col>
			</Row>
			<Row gutter={[16, 16]} style={{ marginBottom: "16px" }}>
				<Col xs={24} md={8} className="col">
					<div
						style={{
							// textAlign: "center",
							// display: "flex",
							// flexDirection: "column",
							// justifyContent: "flex-end",
							// alignItems: "center",
							padding: "20px",
							// background: "#fff",
						}}
					>
						<img src={logo2} alt="logo" className="footerImg" height={50} />
						<p className="playfair-display-normal" style={{ color: "#ccc" }}>
							Copyright, {new Date().getFullYear()}
						</p>
					</div>
				</Col>
				<Col xs={24} md={8} style={{ minHeight: "140px" }} className="col">
					<div
						style={{
							// textAlign: "center",
							display: "flex",
							alignItems: "center",
							flexDirection: "column",
							// justifyContent: "flex-end",
							padding: "20px",
						}}
					>
						<h2 className="playfair-display-bold" style={{ color: "#fff" }}>
							More
						</h2>
						<ul>
							<li>
								<Link to={URL.ABOUT}>About Us</Link>
							</li>
							<li>
								<Link to={URL.TERMS}>Terms of use</Link>
							</li>
							<li>
								<Link to={URL.PRIVACY}>Privacy Policy</Link>
							</li>
							<li>
								<Link to={URL.BLOG}>Blog</Link>
							</li>
							<li>
								<Link to={URL.CONTACT}>Contact</Link>
							</li>
						</ul>
					</div>
				</Col>
				<Col xs={24} md={8} style={{ minHeight: "140px" }} className="col">
					<div
						style={{
							textAlign: "center",
							padding: "20px",
						}}
					>
						<h2 className="playfair-display-bold" style={{ color: "#fff" }}>
							Contacts
						</h2>
						<ul>
							<li>
								<a href="">info@sophia.com</a>
							</li>
							<li>
								<a href="">+44 234 234 234567</a>
							</li>
						</ul>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default Footer;
