import React, { useState } from "react";
import "./Loginpage.styles.scss";
import { Col, Form, Input, Row, Button as AntDButton, FormProps } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Logo, student, woman } from "../../../assets";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { AuthRequest, ClientRequest } from "../../../requests";
import { useAlert, useAuth, useUser } from "../../../store";

import { setStoredAuthToken } from "../../../utils/storage";
import { APPCONSTANTS, URL as Urlconstant } from "../../../utils/constants";
import { getTokenData } from "../../../utils/helperFunction";

type FieldType = {
	email?: string;
	password?: string;
	remember?: string;
};

const Loginpage: React.FC<any> = () => {
	const [loading, setLoading] = useState(false);
	const [reactivateMode, setReactivateMode] = useState(false);

	const { onFailure: AlertFailure, onSuccess } = useAlert();
	const { onLogin } = useAuth();
	const nav = useNavigate();
	const location = useLocation();
	const setUser = useUser((s) => s.setUser);

	// Security check for redirect URLs
	const isValidRedirect = (url: string) => {
		try {
			const { hostname, pathname } = new URL(url, window.location.origin);
			if (hostname !== window.location.hostname) return false;
			// Block explicit admin/instructor areas
			if (pathname.startsWith('/admin') || pathname.startsWith('/instructor')) return false;
			// Allow same-origin app paths (including /posts/:id, /profile, / etc.)
			return pathname.startsWith('/');
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
		return redirectUrl || Urlconstant.HOME; // Default to home if no valid redirect
	};

	const onFinish: FormProps<FieldType>["onFinish"] = async (values: any) => {
		setLoading(true);
		try {
			if (reactivateMode) {
				const res: any = await ClientRequest.reactivate({ email: values.email, password: values.password });
				onSuccess("Account reactivated!");
				onLogin(res?.access_token);
				setStoredAuthToken(res?.access_token, "student");
				// refresh profile after reactivation
				try {
					const me: any = await ClientRequest.getMe();
					if (me) setUser(me);
				} catch {}
				nav(getSafeRedirectUrl());
			} else {
				const res: any = await AuthRequest.login(values);
				onSuccess("Login successful!");
				onLogin(res?.access_token);
				setStoredAuthToken(res?.access_token, "student");
				// Redirect to safe URL after login
				nav(getSafeRedirectUrl());
			}
		} catch (error: any) {
			console.error("Login error:", error);
			AlertFailure(error.message);
			// If backend signals deactivated account via redirect param, user can switch manually
		} finally {
			setLoading(false);
		}
	};

	const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
		errorInfo: any
	) => {
		console.log("Failed:", errorInfo);
	};

	const handleGoogleLogin = async (data: any) => {
		try {
			const token: string = data.credential;
			const tokenData: any = getTokenData(token);
			const payload = {
				email: tokenData.email,
				password: tokenData.sub,
			};
			const res: any = await AuthRequest.login(payload);
			onSuccess("Login successful!");
			onLogin(res?.access_token);
			setStoredAuthToken(res?.access_token, "student");

			// Redirect to safe URL after Google login
			nav(getSafeRedirectUrl());
		} catch (error: any) {
			console.error("Login error:", error);
			AlertFailure(error.message);
		}
	};

	React.useEffect(() => {
		const params = new URLSearchParams(location.search);
		if (params.get('reactivate') === '1') setReactivateMode(true);
	}, [location.search]);

	return (
		<div className="student_login">

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
						<h2>{reactivateMode ? 'Reactivate Account' : 'Login'}</h2>
						<p className="inter-normal">
							{reactivateMode ? 'Enter your credentials to reactivate your account' : 'Enter email address and password to login'}
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
								rules={[{ required: true, message: 'Please input your email!', type: 'email' }]}
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
										className="font-inter"
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
									{reactivateMode ? 'Reactivate' : 'Log in'}
								</AntDButton>
							</Form.Item>
							<div className="flex justify-center mb-2">
								{!reactivateMode ? (
									<button type="button" onClick={() => setReactivateMode(true)} className="text-sm underline" style={{color:'#581A57'}}>
										Trouble logging in? Reactivate account
									</button>
								) : (
									<button type="button" onClick={() => setReactivateMode(false)} className="text-sm underline" style={{color:'#581A57'}}>
										Back to login
									</button>
								)}
							</div>

							<Form.Item
								className="font-inter text-[16px] leading-[19.36px]"
								style={{ textAlign: "center" }}
							>
								Don't have an account?{" "}
								<Link
									to={Urlconstant.REGISTER}
									className="font-inter font-medium"
									style={{ color: "#581A57" }}
								>
									Become a member
								</Link>
							</Form.Item>
							<Form.Item>
								<div className="option">
									<span className="line"></span>
									<p className="mt-[11px] sm:mt-[30px]">or</p>
									<span className="line"></span>
								</div>
							</Form.Item>
							<GoogleOAuthProvider clientId="1099244600879-519hr40scavako9ousgbr0aqo1iaqupk.apps.googleusercontent.com">
								<GoogleLogin
									onSuccess={(credentialResponse) =>
										handleGoogleLogin(credentialResponse)
									}
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