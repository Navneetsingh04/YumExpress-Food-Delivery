import React, { useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { verifyOrder } from "../../lib/api";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("OrderId");
  const navigate = useNavigate();

  useEffect(() => {
    const performVerification = async () => {
      try {
        const res = await verifyOrder({ success, orderId });
        if (res.success) {
          toast.success("Payment verified successfully!");
          navigate("/myorders");
        } else {
          toast.error(res.message || "Payment verification failed.");
          navigate("/");
        }
      } catch (error) {
        toast.error("Network error. Unable to verify payment.");
        navigate("/");
      }
    };

    if (orderId) {
      performVerification();
    } else {
      navigate("/");
    }
  }, [success, orderId, navigate]);

  return (
    <div className="verify">
      <div className="spinner"></div>
      <p>Verifying payment, please wait...</p>
    </div>
  );
};

export default Verify;
