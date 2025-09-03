import React, { useState } from "react";
import "./Loginpage.styles.scss";
import { Col, Form, Input, Row, Button as AntDButton, FormProps } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo, student, woman } from "../../../assets";
import { AuthRequest } from "../../../requests";
import { useAlert, useAuth } from "../../../store";
import { setStoredAuthToken } from "../../../utils/storage";
import { APPCONSTANTS, URL as Urlconstant } from "../../../utils/constants";

type FieldType = {
	username?: string;
	password?: string;
	remember?: string;
};

const Loginpage: React.FC<any> = () => {
	const [loading, setLoading] = useState(false);
	const { onFailure: AlertFailure, onSuccess } = useAlert();
	const { onLogin } = useAuth();
	const nav = useNavigate();
	const location = useLocation();

	// Security check for redirect URLs
	const isValidRedirect = (url: string) => {
		try {
			const { hostname, pathname } = new URL(url, window.location.origin);
			return hostname === window.location.hostname &&
				pathname.startsWith('/admin'); // Only allow admin routes
		} catch {
			return false;
		}
	};

	const getSafeRedirectUrl = () => {
		const queryParams = new URLSearchParams(location.search);
		const redirectParam = queryParams.get('redirect');
		const storedRedirect = localStorage.getItem('redirectUrl');

		// Check URL validity
		const redirectUrl = [redirectParam, storedRedirect]
			.find(url => url && isValidRedirect(url));

		localStorage.removeItem('redirectUrl');
		return redirectUrl || Urlconstant.ADMIN_OVERVIEW; // Default to admin overview
	};

	const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
		setLoading(true);
		try {
			const res: any = await AuthRequest.adminLogin(values);
			onSuccess("Login successful!");
			onLogin(res?.access_token);
			setStoredAuthToken(res?.access_token, "admin");

			// Redirect to safe URL after login
			nav(getSafeRedirectUrl());
		} catch (error: any) {
			console.error("Login error:", error);
			AlertFailure(error.message);
		} finally {
			setLoading(false);
		}
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo: any
	) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className="login">
			<Row style={{}}>
				{/* Desktop View */}
				<Col xs={{ span: 0 }} lg={{ span: 12 }}>
					<div className="first-container">
						<Link to={Urlconstant.HOME}>
							<img
								src={Logo}
								alt="logo"
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
						<h2 className="inter-bold">Welcome Back!!</h2>
						<p className="inter-normal">
							Learn your best academic skills, showcase your enterprise project
							and connect with investors and employers!
						</p>
					</div>
				</Col>
				<Col xs={{ span: 24 }} lg={{ span: 12 }}>
					<div className="login-container" style={{}}>
						<Link to={Urlconstant.HOME} className="midlogo">
							<img
								src={Logo}
								alt="Login"
								style={{ maxWidth: "100%", maxHeight: "100%" }}
							/>
						</Link>
						<h2>Login</h2>
						<p className="inter-normal">
							Enter username and password to login
						</p>
						<Form
							layout="vertical"
							initialValues={{ remember: true }}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
						>
							<Form.Item
								label="Username"
								className="inter-normal"
								name={"username"}
								rules={[{ required: true, message: 'Please input your username!' }]}
							>
								<Input />
							</Form.Item>
							<Form.Item
								label="Password"
								className="inter-normal"
								name={"password"}
								rules={[{ required: true, message: 'Please input your password!' }]}
							>
								<Input.Password />
							</Form.Item>
							<div className="flex justify-end">
								<Form.Item className="inter-bold">
									<Link
										to={Urlconstant.FORGOT_PASSWORD}
										style={{
											color: APPCONSTANTS.APP_DARK_PURPLE,
											float: "right",
										}}
									>
										Forgot password?
									</Link>
								</Form.Item>
							</div>

							<Form.Item className="inter-normal">
								<AntDButton
									loading={loading}
									htmlType="submit"
									disabled={loading}
									className="h-[50px] w-full !bg-[#581A57] !text-white p-5 hover:"
								>
									Log in
								</AntDButton>
							</Form.Item>
						</Form>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default Loginpage;