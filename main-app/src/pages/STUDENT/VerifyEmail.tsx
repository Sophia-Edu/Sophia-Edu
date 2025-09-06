import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Spin, Result, Button } from "antd";
import { useAlert } from "../../store";
import authRequests from "../../requests/auth.request";
import { URL } from "../../utils/constants";

const VerifyEmail: React.FC = () => {
  const location = useLocation();
  const nav = useNavigate();
  const { onSuccess, onFailure } = useAlert();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification link. Please check the link sent to your email.");
      onFailure("No verification token found.");
      return;
    }

    const verify = async () => {
      try {
        await authRequests.verifyEmail({ token });
        setStatus("success");
        setMessage("Your email has been verified successfully! You can now log in.");
        onSuccess("Email verified successfully!");
      } catch (e: any) {
        setStatus("error");
        const errorMsg = e?.message || "Verification failed. The link may be invalid or expired.";
        setMessage(errorMsg);
        onFailure(errorMsg);
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  return (
    <div className="verify-email-container" style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      height: "100vh",
      textAlign: "center"
    }}>
      {status === "loading" ? (
        <Spin size="large" tip="Verifying email..." />
      ) : (
        <Result
          status={status}
          title={status === "success" ? "Email Verified" : "Verification Failed"}
          subTitle={message}
          extra={
            <Button 
              type="primary" 
              onClick={() => nav(URL.LOGIN)}
            >
              Go to Login
            </Button>
          }
        />
      )}
    </div>
  );
};

export default VerifyEmail;
