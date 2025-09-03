import React, { useState } from "react";
import "./Loginpage.styles.scss";
import { Col, Form, Input, Row, Button as AntDButton, FormProps } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo, student, woman } from "../../../assets";
import { AuthRequest } from "../../../requests";
import { useAlert, useAuth } from "../../../store";
import { setStoredAuthToken } from "../../../utils/storage";
import { APPCONSTANTS, URL as  UrlConst } from "../../../utils/constants";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

type FieldType = {
	email?: string;
	password?: string;
	remember?: string;
};

const Loginpage: React.FC<any> = () => {
	const [loading, setLoading] = useState(false);
	const { onFailure: AlertFailure, onSuccess } = useAlert();
	const { onLogin } = useAuth();
	const nav = useNavigate();
	const location = useLocation();

	const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
		setLoading(true);
		try {
			const res: any = await AuthRequest.instructorLogin(values);
			onSuccess("Login successful!");
			onLogin(res?.access_token);
			setStoredAuthToken(res?.access_token, "instructor");

			// Handle redirect after login
			const queryParams = new URLSearchParams(location.search);
			const redirectUrl = queryParams.get('redirect') || localStorage.getItem('redirectUrl');

			if (redirectUrl && isValidRedirect(redirectUrl)) {
				localStorage.removeItem('redirectUrl');
				nav(redirectUrl);
			} else {
				nav(UrlConst.OVERVIEW); // Default redirect
			}
		} catch (error: any) {
			console.error("Login error:", error);
			AlertFailure(error.message);
		} finally {
			setLoading(false);
		}
	};

	// Security check for redirect URLs
	const isValidRedirect = (url: string) => {
		try {
			const { hostname, pathname } = new URL(url, window.location.origin);
			return hostname === window.location.hostname &&
				pathname.startsWith('/instructor'); // Only allow instructor routes
		} catch {
			return false;
		}
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className="login">
			<Row style={{}}>
				{/* Desktop View */}
				<Col xs={{ span: 0 }} lg={{ span: 12 }}>
					<div className="first-container">
						<Link to={UrlConst.HOME}>
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
						<Link to={UrlConst.HOME} className="midlogo">
							<img
								src={Logo}
								alt="Login"
								style={{ maxWidth: "100%", maxHeight: "100%" }}
							/>
						</Link>
						<h2>Login</h2>
						<p className="inter-normal">
							Enter email address and password to login
						</p>
						<Form
							layout="vertical"
							initialValues={{ remember: true }}
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
						>
							<Form.Item
								label="Email address"
								className="inter-normal"
								name={"email"}
								rules={[{ required: true, message: 'Please input your email!' }]}
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
										to={UrlConst.FORGOT_PASSWORD}
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
							<Form.Item>
								<div className="option">
									<span className="line"></span>
									<p style={{ marginTop: 30 }}>or</p>
									<span className="line"></span>
								</div>
							</Form.Item>
							<GoogleOAuthProvider clientId="721301716315-o03cg1fbq3kj16730r309rq850n8v29h.apps.googleusercontent.com">
								<GoogleLogin
									useOneTap
									onSuccess={(credentialResponse) => {
										console.log(credentialResponse);
										// You should implement similar redirect logic for Google login
									}}
									onError={() => {
										console.log("Login Failed");
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

export default Loginpage;