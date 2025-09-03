import React, { useState } from "react";
import "./Registerpage.styles.scss";
import {
	Col,
	Form,
	Input,
	Row,
	Button as AntDButton,
	FormProps,
	Checkbox,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthRequest } from "../../../requests";
import { useAlert } from "../../../store";
import { URL } from "../../../utils/constants";
import { Logo, student, woman } from "../../../assets";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { getTokenData } from "../../../utils/helperFunction";

type FieldType = {
	full_name?: string;
	email?: string;
	password?: string;
	confirm_password?: string;
	agree?: boolean;
};

const Registerpage: React.FC<any> = () => {
	const nav = useNavigate();
	const [loading, setLoading] = useState(false);
	const { onFailure: AlertFailure, onSuccess } = useAlert(); // Assuming useAlert handles success and failure alerts

	const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
		setLoading(true);
		try {
			const res = await AuthRequest.register(values); // Assuming AuthRequest returns a promise
			console.log(res); // Log response if needed
			onSuccess("Registration successful!"); // Trigger success alert
			nav(URL.LOGIN);
		} catch (error: any) {
			console.error("Registration error:", error);
			AlertFailure(error.message); // Trigger failure alert
		} finally {
			setLoading(false);
		}
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo: any
	) => {
		console.log("Failed:", errorInfo);
	};
	const handleGoogleRegistration = async (data: any) => {
		try {
			const token: string = data.credential;
			const tokenData: any = getTokenData(token);
			const payload = {
				full_name: tokenData.name,
				email: tokenData.email,
				provider: "google",
				password: tokenData.sub,
				confirm_password: tokenData.sub,
			};
			await AuthRequest.register(payload); // Assuming AuthRequest returns a promise
			onSuccess("Registration successful!"); // Trigger success alert
			nav(URL.LOGIN);
		} catch (error: any) {
			console.error("Login error:", error);
			AlertFailure(error.message); // Trigger failure alert
		}
	};
	return (
		<div className="register">
			<Row style={{}}>
				{/* Desktop View */}
				<Col xs={{ span: 0 }} lg={{ span: 12 }}>
					<div className="first-container">
						<Link to={URL.HOME}>
							<img
								src={Logo}
								alt="Login"
								style={{ maxWidth: "100%", maxHeight: "100%" }}
							/>
						</Link>
						<div className="main w-full xl:w-[780px]">
							<img src={student} alt="students studying" />
							<img
								src={woman}
								alt="graduating woman"
								className="right-[1rem] xl:right-[15rem] bottom-[2rem]"
							/>
						</div>
						<h2 className="inter-bold">Join Our Community!!</h2>
						<p className="inter-normal">
							Learn your best academic skills, showcase your enterprise project and connect with investors and employers!
						</p>
					</div>
				</Col>
				<Col xs={{ span: 24 }} lg={{ span: 12 }}>
					<div className="register-container" style={{}}>
						<Link to={URL.HOME} className="midlogo">
							<img
								src={Logo}
								alt="Login"
								style={{ maxWidth: "100%", maxHeight: "100%" }}
							/>
						</Link>
						<h2>Become a member</h2>
						<p className="inter-normal">
							Enter email address and password to register
						</p>
						<Form
							layout="vertical"
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
						>
							<Form.Item
								label="Full name"
								name="full_name"
								className="inter-normal"
								rules={[
									{ required: true, message: "Please enter your full name" },
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="Email address"
								name="email"
								className="inter-normal"
								rules={[
									{
										required: true,
										message: "Please enter your email address",
									},
									{
										type: "email",
										message: "Please enter a valid email address",
									},
								]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="Password"
								name="password"
								className="inter-normal"
								rules={[
									{ required: true, message: "Please enter your password" },
									{
										min: 6,
										message: "Password must be at least 6 characters long",
									},
								]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item
								label="Confirm password"
								name="confirm_password"
								className="inter-normal"
								dependencies={["password"]}
								hasFeedback
								rules={[
									{ required: true, message: "Please confirm your password" },
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue("password") === value) {
												return Promise.resolve();
											}
											return Promise.reject(
												new Error("Passwords do not match")
											);
										},
									}),
								]}
							>
								<Input.Password />
							</Form.Item>
							<Form.Item
								name="agree"
								valuePropName="checked"
								rules={[
									{
										validator: (_, value) =>
											value
												? Promise.resolve()
												: Promise.reject(
														new Error(
															"You must agree to the terms of use and privacy"
														)
												  ),
									},
								]}
							>
								<Checkbox>
									I agree to the{" "}
									<a
										target="_blank"
										href="https://sophia-landing.netlify.app/terms-of-use/"
										className="font-inter text-[#581a57] font-semibold"
									>
										terms of use{" "}
									</a>
									<span>and</span>
									<a
										target="_blank"
										href="https://sophia-landing.netlify.app/privacy/"
										className="font-inter text-[#581a57] font-semibold"
									>
										{" "}
										privacy policy
									</a>
								</Checkbox>
							</Form.Item>
							<Form.Item className="inter-normal">
								<AntDButton
									className="h-[50px] w-full bg-[#581A57] text-white p-5 hover:"
									loading={loading}
									htmlType="submit"
								>
									Create Account
								</AntDButton>
							</Form.Item>
							<Form.Item
								className="font-inter text-[16px] leading-[19.36px]"
								style={{ textAlign: "center" }}
							>
								Already have an account?{" "}
								<Link
									to={URL.LOGIN}
									className="inter-bold"
									style={{ color: "#581A57" }}
								>
									Login
								</Link>
							</Form.Item>
							<Form.Item>
								<div className="option">
									<span className="line"></span>
									<p style={{ marginTop: 30 }}>or</p>
									<span className="line"></span>
								</div>
							</Form.Item>
							<GoogleOAuthProvider clientId="1099244600879-519hr40scavako9ousgbr0aqo1iaqupk.apps.googleusercontent.com">
								<GoogleLogin
									onSuccess={(credentialResponse) =>
										handleGoogleRegistration(credentialResponse)
									}
									onError={() => {
										console.log("Sign up Failed");
									}}
								/>
							</GoogleOAuthProvider>
						</Form>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default Registerpage;
