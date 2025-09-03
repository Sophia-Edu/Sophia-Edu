import React from "react";
import "./SetPasswordpage.styles.scss";
import { Col, Form, Input, Row } from "antd";
import { Button } from "../../components";
import { logo, student, woman } from "../../assets";
import { Link } from "react-router-dom";
import { URL } from "../../constants";

const SetPasswordpage: React.FC<any> = () => {
	return (
		<div className="setpassword">
			<Row style={{}}>
				{/* Desktop View */}
				<Col xs={{ span: 0 }} lg={{ span: 12 }}>
					<div className="first-contain">
						<img
							src={logo}
							alt="regsister"
							style={{ maxWidth: "100%", maxHeight: "100%" }}
						/>
						<div className="main">
							<img src={student} alt="students studying" />
							<img src={woman} alt="graduating woman" />
						</div>
						<h2 className="inter-bold">Welcome Back!!</h2>
						<p className="inter-normal">
							Lorem ipsum dolor sit amet consectetur. At morbi in amet et sed.
						</p>
					</div>
				</Col>
				<Col xs={{ span: 24 }} lg={{ span: 12 }}>
					<div className="setpassword-contain" style={{}}>
						<Link to={URL.HOME} className="midlogo">
							<img
								src={logo}
								alt="Login"
								style={{ maxWidth: "100%", maxHeight: "100%" }}
							/>
						</Link>
						<h2>Set password</h2>
						<p className="inter-normal">
							Enter new password and sign in to your account
						</p>
						<Form layout="vertical">
							<Form.Item label="New Password" className="inter-normal">
								<Input.Password />
							</Form.Item>
							<Form.Item label="Confirm password" className="inter-normal">
								<Input.Password />
							</Form.Item>

							<Form.Item className="inter-normal">
								<Button height={50} width={"100%"}>
									Set new password
								</Button>
							</Form.Item>
						</Form>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default SetPasswordpage;
