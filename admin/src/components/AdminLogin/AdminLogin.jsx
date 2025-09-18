import { useState } from "react";
import "./AdminLogin.css";
import { useAppDispatch, useAdminAuth } from "../../store/hooks";
import { loginAdmin } from "../../store/slices/adminAuthSlice";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react"; 

const AdminLogin = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAdminAuth();
  const [showSecretKey, setShowSecretKey] = useState(false);

  const [data, setData] = useState({
    email: "",
    password: "",
    adminSecretKey: "",
  });

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginAdmin(data)).unwrap();
      toast.success("Admin login successful!");
    } catch (error) {
      toast.error(error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={onLogin} className="admin-login-form">
        <h2>Admin Portal</h2>
        <p className="subtitle">YumExpress Dashboard</p>

        <div className="security-banner">
          <p>Authorized Personnel Only</p>
          <small>This area is restricted to administrators</small>
        </div>

        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Admin email"
          required
          disabled={loading}
        />
        <input
          name="password"
          onChange={onChangeHandler}
          value={data.password}
          type="password"
          placeholder="Password"
          required
          minLength="8"
          disabled={loading}
        />

        <div className="secret-key">
          <input
            name="adminSecretKey"
            onChange={onChangeHandler}
            value={data.adminSecretKey}
            type={showSecretKey ? "text" : "password"}
            placeholder="Admin Secret Key"
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowSecretKey(!showSecretKey)}
            disabled={loading}
          >
            {showSecretKey ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button type="submit" disabled={loading} className="login-btn">
          {loading ? "Authenticating..." : "Secure Login"}
        </button>

        <label className="terms">
          <input type="checkbox" required /> I confirm I have authorized access.
        </label>

        <p className="help">ℹ️ Need admin access? Contact system administrator</p>
      </form>
    </div>
  );
};

export default AdminLogin;
