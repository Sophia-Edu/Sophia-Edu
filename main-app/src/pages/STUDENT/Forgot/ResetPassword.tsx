import React, { useMemo, useState, useEffect } from "react";
import "./Forgotpage.styles.scss";
import { Col, Form, Input, Row, Button as AntDButton, Result } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo, student, woman } from "../../../assets";
import { useAlert } from "../../../store";
import authRequests from "../../../requests/auth.request";
import { URL as Urlconstant } from "../../../utils/constants";

const ResetPasswordPage: React.FC<any> = () => {
  const [form] = Form.useForm();
  const { onSuccess, onFailure } = useAlert();
  const [loading, setLoading] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<"valid" | "invalid" | "loading">("loading");
  const location = useLocation();
  const nav = useNavigate();

  const tokenFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("token") || "";
  }, [location.search]);

  useEffect(() => {
    if (tokenFromQuery) {
      // Optional: Validate token with backend before allowing reset
      const validateToken = async () => {
        try {
          // You might want to add a specific token validation endpoint
          // For now, we'll just check if the token is not empty
          setTokenStatus(tokenFromQuery ? "valid" : "invalid");
        } catch (error) {
          setTokenStatus("invalid");
          onFailure("Invalid or expired reset link.");
        }
      };
      validateToken();
    } else {
      setTokenStatus("invalid");
    }
  }, [tokenFromQuery, onFailure]);

  const onFinish = async (values: { new_password: string; confirm_password: string }) => {
    try {
      setLoading(true);
      if (!values.new_password || !values.confirm_password) {
        return onFailure("Please enter and confirm your new password");
      }
      if (values.new_password !== values.confirm_password) {
        return onFailure("New password and confirm password do not match");
      }
      
      await authRequests.resetPassword({
        token: tokenFromQuery,
        new_password: values.new_password,
        confirm_password: values.confirm_password,
      });
      
      onSuccess("Password has been reset successfully");
      nav(Urlconstant.LOGIN);
    } catch (e: any) {
      onFailure(e?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (tokenStatus === "invalid") {
    return (
      <div className="student_login" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Result
          status="error"
          title="Invalid Reset Link"
          subTitle="The password reset link is invalid or has expired. Please request a new password reset."
          extra={[
            <Link to={Urlconstant.FORGOT_PASSWORD} key="reset">
              <AntDButton type="primary">
                Request New Reset Link
              </AntDButton>
            </Link>
          ]}
        />
      </div>
    );
  }

  if (tokenStatus === "loading") {
    return (
      <div className="student_login" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <AntDButton loading>Validating Reset Link...</AntDButton>
      </div>
    );
  }

  return (
    <div className="student_login">
      <Row>
        {/* Desktop View */}
        <Col xs={{ span: 0 }} lg={{ span: 12 }}>
          <div className="first-container">
            <Link to={Urlconstant.HOME}>
              <img src={Logo} alt="logo" style={{ maxWidth: "100%", maxHeight: "100%" }} />
            </Link>

            <div className="main w-full xl:w-[780px]">
              <img src={student} alt="students studying" />
              <img
                src={woman}
                alt="graduating woman"
                className="right-[1rem] xl:right-[15rem] bottom-[2rem]"
              />
            </div>
            <h2>Reset Password</h2>
            <p className="inter-normal">Enter your new password below</p>
          </div>
        </Col>

        <Col xs={{ span: 24 }} lg={{ span: 12 }}>
          <div className="login-container">
            <Link to={Urlconstant.HOME} className="midlogo">
              <img src={Logo} alt="Reset Password" style={{ maxWidth: "100%", maxHeight: "100%" }} />
            </Link>
            <Form 
              layout="vertical" 
              form={form} 
              onFinish={onFinish}
            >
              <Form.Item 
                label="New Password" 
                name="new_password" 
                rules={[{ required: true, message: "Enter new password" }]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item 
                label="Confirm Password" 
                name="confirm_password" 
                dependencies={['new_password']}
                rules={[
                  { required: true, message: "Confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new_password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <AntDButton
                  loading={loading}
                  htmlType="submit"
                  disabled={loading}
                  className="h-[50px] w-full !bg-[#581A57] !text-white p-5 hover:"
                >
                  Reset Password
                </AntDButton>
              </Form.Item>

              <Form.Item style={{ textAlign: "center" }}>
                <Link to={Urlconstant.LOGIN} className="font-inter" style={{ color: "#581A57" }}>
                  Back to login
                </Link>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPasswordPage;
