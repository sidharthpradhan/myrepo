import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/forms/Input";
import LoadingButton from "../../components/common/LoadingButton";
import { login } from "../../store/slices/authSlice";
import { notify } from "../../utils/notify";

const demos = [
  { label: "Super Admin", email: "superadmin@skillomi.test" },
  { label: "Company Admin", email: "admin.acme@skillomi.test" },
  { label: "Learner", email: "maya.patel@acme.test" },
];

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.auth.loading);
  const [email, setEmail] = useState("superadmin@skillomi.test");
  const [password, setPassword] = useState("Password123");
  const [success, setSuccess] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      await dispatch(login({ email, password })).unwrap();
      setSuccess(true);
      notify.success("Welcome back");
      navigate("/app/dashboard");
    } catch (error) {
      notify.error(error.message || "Unable to sign in");
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <h2 className="text-xl font-semibold">Sign in</h2>
        <p className="text-sm text-muted">Use a demo account. Password is Password123.</p>
      </div>
      <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <LoadingButton type="submit" className="w-full" loading={loading} success={success} loadingText="Signing in...">
        Sign in
      </LoadingButton>
      <Link to="/forgot-password" className="block text-center text-sm text-primary">
        Forgot password?
      </Link>
      <div className="space-y-2 rounded-xl bg-raised p-3 text-sm">
        {demos.map((item) => (
          <button
            key={item.email}
            type="button"
            className="flex w-full items-center justify-between rounded-lg px-2 py-1 hover:bg-surface"
            onClick={() => setEmail(item.email)}
          >
            <span>{item.label}</span>
            <span className="text-muted">{item.email}</span>
          </button>
        ))}
      </div>
    </form>
  );
}
