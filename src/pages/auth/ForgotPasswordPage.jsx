import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/forms/Input";
import LoadingButton from "../../components/common/LoadingButton";
import { authService } from "../../services/authService";
import { notify } from "../../utils/notify";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await authService.forgotPassword(email);
      setSuccess(true);
      notify.success(result.message);
    } catch (error) {
      notify.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <h2 className="text-xl font-semibold">Reset password</h2>
        <p className="text-sm text-muted">We will send a mock reset link for the prototype.</p>
      </div>
      <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <LoadingButton type="submit" className="w-full" loading={loading} success={success} loadingText="Sending...">
        Send reset link
      </LoadingButton>
      <Link to="/login" className="block text-center text-sm text-primary">
        Back to sign in
      </Link>
    </form>
  );
}
