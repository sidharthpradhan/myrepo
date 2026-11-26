import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Input from "../../components/forms/Input";
import LoadingButton from "../../components/common/LoadingButton";
import { companyService } from "../../services/companyService";
import { fetchCompanies, updateCompany } from "../../store/slices/companySlice";
import { notify } from "../../utils/notify";
import ThemeSwitcher from "../../components/layout/ThemeSwitcher";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const actor = useSelector((state) => state.auth.user);
  const companies = useSelector((state) => state.companies.items);
  const company = companies.find((item) => item.id === actor.companyId) || companies[0];
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (company) setForm(company);
  }, [company]);

  if (!form) {
    return (
      <div>
        <PageHeader title="Settings" description="Theme is available to every role. Company profile is shown when you belong to a tenant." />
        <Card title="Appearance">
          <ThemeSwitcher />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Settings" description="Company profile, learning defaults, and appearance." />
      <Card title="Company profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Company name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <Input label="Logo initials" value={form.logo} onChange={(event) => setForm({ ...form, logo: event.target.value })} />
          <Input label="Timezone" value={form.timezone} onChange={(event) => setForm({ ...form, timezone: event.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.settings?.allowSelfEnrollment}
              onChange={(event) =>
                setForm({ ...form, settings: { ...form.settings, allowSelfEnrollment: event.target.checked } })
              }
            />
            Allow self enrollment
          </label>
        </div>
        <LoadingButton
          className="mt-4"
          loading={saving}
          onClick={async () => {
            setSaving(true);
            if (company) await dispatch(updateCompany({ id: company.id, payload: form }));
            else await companyService.update(form.id, form);
            notify.success("Settings saved");
            setSaving(false);
          }}
        >
          Save changes
        </LoadingButton>
      </Card>
      <Card title="Appearance">
        <p className="mb-3 text-sm text-muted">Light, dark, system, and primary color. Stored in localStorage.</p>
        <ThemeSwitcher />
      </Card>
    </div>
  );
}
