import { Outlet } from "react-router-dom";
import { APP_NAME, APP_TAGLINE } from "../constants/app";

export default function AuthLayout() {
  return (
    <div className="flex h-full overflow-y-auto bg-app">
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center gap-8 px-4 py-10 lg:flex-row lg:items-center">
        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">{APP_NAME}</p>
          <h1 className="mt-2 max-w-md text-4xl font-semibold">{APP_TAGLINE}</h1>
          <p className="mt-3 max-w-md text-muted">
            Multi-company LMS and LXP with permission-based access. This prototype uses static JSON behind a service layer.
          </p>
        </div>
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
