import { Col, Row } from "antd";
import React from "react";
import { logo } from "../../assets";
import { Button } from "..";
import { Link } from "react-router-dom";
import { URL } from "../../constants";
import "./navbar.styles.scss";

const Navbar: React.FC = () => {
	return (
		<Row justify="space-between" align="top" className="navbar">
			<Link to={URL.HOME}>
				<Col xs={12} sm={10} md={8} lg={6} xl={5}>
					{/* Your logo component */}
					<img src={logo} alt="Logo" className="max-w-screen-xl" />
				</Col>
			</Link>
			<a href={"https://sophia-main-app.netlify.app/login"} target="_blank">
				<Button>Login</Button>
			</a>
		</Row>
	);
};

export default Navbar;
