import React, { useMemo, useState } from "react";
import "./Forgotpage.styles.scss";
import { Col, Form, Input, Row, Button as AntDButton } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo, student, woman } from "../../../assets";
import { useAlert } from "../../../store";
import authRequests from "../../../requests/auth.request";
import { URL as Urlconstant } from "../../../utils/constants";

const ResetPasswordPage: React.FC<any> = () => {
  const [form] = Form.useForm();
  const { onSuccess, onFailure } = useAlert();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const nav = useNavigate();

  const tokenFromQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("token") || "";
  }, [location.search]);

  const onFinish = async (values: { token: string; new_password: string; confirm_password: string }) => {
    try {
      setLoading(true);
      if (!values.new_password || !values.confirm_password) {
        return onFailure("Please enter and confirm your new password");
      }
      if (values.new_password !== values.confirm_password) {
        return onFailure("New password and confirm password do not match");
      }
      await authRequests.resetPassword({
        token: values.token,
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
            <Form layout="vertical" form={form} onFinish={onFinish} initialValues={{ token: tokenFromQuery }}>
              <Form.Item label="Token" name="token" rules={[{ required: true, message: "Missing token" }]}>
                <Input placeholder="Paste reset token" />
              </Form.Item>
              <Form.Item label="New Password" name="new_password" rules={[{ required: true, message: "Enter new password" }]}>
                <Input.Password />
              </Form.Item>
              <Form.Item label="Confirm Password" name="confirm_password" rules={[{ required: true, message: "Confirm your password" }]}>
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
