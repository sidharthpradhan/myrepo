import Input from "../../components/forms/Input";
import Select from "../../components/forms/Select";
import LoadingButton from "../../components/common/LoadingButton";
import Button from "../../components/common/Button";
import Modal from "../../components/modals/Modal";
import { COMPANY_STATUSES } from "../../constants/app";
import { useState, useEffect } from "react";

export default function CompanyForm({ open, initial, users, onClose, onSubmit, saving }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm({
      name: "",
      industry: "",
      timezone: "UTC",
      email: "",
      status: "active",
      adminUserId: "",
      ...initial,
    });
  }, [initial, open]);

  if (!open) return null;

  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal
      open={open}
      title={initial?.id ? "Edit company" : "Create company"}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton loading={saving} onClick={() => onSubmit({ ...form, adminUserId: form.adminUserId ? Number(form.adminUserId) : null })}>
            Save changes
          </LoadingButton>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Company name" value={form.name} onChange={(event) => change("name", event.target.value)} />
        <Input label="Industry" value={form.industry} onChange={(event) => change("industry", event.target.value)} />
        <Input label="Timezone" value={form.timezone} onChange={(event) => change("timezone", event.target.value)} />
        <Input label="Email" value={form.email} onChange={(event) => change("email", event.target.value)} />
        <Select
          label="Status"
          value={form.status}
          onChange={(event) => change("status", event.target.value)}
          options={COMPANY_STATUSES.map((status) => ({ value: status, label: status }))}
        />
        <Select
          label="Company admin"
          value={form.adminUserId || ""}
          onChange={(event) => change("adminUserId", event.target.value)}
          options={[{ value: "", label: "Unassigned" }, ...users.map((user) => ({ value: user.id, label: user.name }))]}
        />
      </div>
    </Modal>
  );
}
