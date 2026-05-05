import React, { useState } from "react";
import "./Forgotpage.styles.scss";
import { Col, Form, Input, Row } from "antd";
import { Link } from "react-router-dom";
import { Button } from "../../../components";
import { URL } from "../../../utils/constants";
import { Logo, student, woman } from "../../../assets";
import authRequests from "../../../requests/auth.request";
import { useAlert } from "../../../store";

const Forgotpage: React.FC<any> = () => {
    const [form] = Form.useForm();
    const { onSuccess, onFailure } = useAlert();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string }) => {
        try {
            setLoading(true);
            await authRequests.forgotPassword({ email: values.email });
            onSuccess("If this email exists, a password reset link has been sent to your inbox.");
        } catch (e: any) {
            onFailure(e?.message || "Failed to request password reset");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot">
            <Row style={{}}>
                {/* Desktop View */}
                <Col xs={{ span: 0 }} lg={{ span: 12 }}>
                    <div className="first-container">
                        <img
                            src={Logo}
                            alt="forgot"
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                        />
                        <div className="main">
                            <img src={student} alt="students studying" />
                            <img src={woman} alt="graduating woman" />
                        </div>
                        <h2 className="inter-bold">Welcome Back!!</h2>
                        <p className="inter-normal">
                            Learn your best academic skills, showcase your enterprise project 
                            and connect with investors and employers!
                        </p>
                    </div>
                </Col>
                <Col xs={{ span: 24 }} lg={{ span: 12 }}>
                    <div className="forgot-container" style={{}}>
                        <Link to={URL.HOME} className="midlogo">
                            <img
                                src={Logo}
                                alt="Login"
                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                            />
                        </Link>
                        <h2>Forgot password</h2>
                        <p className="inter-normal">
                            Enter email address to recieve mail from us
                        </p>
                        <Form layout="vertical" form={form} onFinish={onFinish}>
                            <Form.Item
                                label="Email address"
                                className="inter-normal"
                                name="email"
                                rules={[
                                    { required: true, message: "Please enter your email" },
                                    { type: "email", message: "Enter a valid email" },
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item className="inter-normal">
                                <Button label="Send email" height={50} width={"100%"} htmlType="submit" loading={loading} disabled={loading} />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Forgotpage;
