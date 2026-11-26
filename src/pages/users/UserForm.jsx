import { useEffect, useState } from "react";
import Input from "../../components/forms/Input";
import Select from "../../components/forms/Select";
import Button from "../../components/common/Button";
import LoadingButton from "../../components/common/LoadingButton";
import Modal from "../../components/modals/Modal";
import { USER_STATUSES } from "../../constants/app";

export default function UserForm({
  open,
  initial,
  invite,
  actor,
  roles,
  departments,
  teams,
  companies,
  saving,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      jobTitle: "",
      phone: "",
      status: invite ? "invited" : "active",
      companyId: actor?.companyId || "",
      roleId: "",
      departmentId: "",
      teamId: "",
      ...initial,
    });
  }, [initial, open, invite, actor]);

  if (!open) return null;
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal
      open={open}
      title={initial?.id ? "Edit user" : invite ? "Invite user" : "Add user"}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton loading={saving} loadingText={invite ? "Inviting..." : "Saving..."} onClick={() => onSubmit(form)}>
            {invite ? "Send invite" : "Save changes"}
          </LoadingButton>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" value={form.firstName} onChange={(event) => change("firstName", event.target.value)} />
        <Input label="Last name" value={form.lastName} onChange={(event) => change("lastName", event.target.value)} />
        <Input label="Email" type="email" value={form.email} onChange={(event) => change("email", event.target.value)} />
        <Input label="Job title" value={form.jobTitle} onChange={(event) => change("jobTitle", event.target.value)} />
        <Input label="Phone" value={form.phone} onChange={(event) => change("phone", event.target.value)} />
        <Select
          label="Status"
          value={form.status}
          onChange={(event) => change("status", event.target.value)}
          options={USER_STATUSES.map((item) => ({ value: item, label: item }))}
        />
        {actor?.companyId == null ? (
          <Select
            label="Company"
            value={form.companyId || ""}
            onChange={(event) => change("companyId", event.target.value)}
            options={[{ value: "", label: "Platform" }, ...companies.map((item) => ({ value: item.id, label: item.name }))]}
          />
        ) : null}
        <Select
          label="Role"
          value={form.roleId || ""}
          onChange={(event) => change("roleId", event.target.value)}
          options={[{ value: "", label: "Select role" }, ...roles.map((item) => ({ value: item.id, label: item.name }))]}
        />
        <Select
          label="Department"
          value={form.departmentId || ""}
          onChange={(event) => change("departmentId", event.target.value)}
          options={[{ value: "", label: "None" }, ...departments.map((item) => ({ value: item.id, label: item.name }))]}
        />
        <Select
          label="Team"
          value={form.teamId || ""}
          onChange={(event) => change("teamId", event.target.value)}
          options={[{ value: "", label: "None" }, ...teams.map((item) => ({ value: item.id, label: item.name }))]}
        />
      </div>
    </Modal>
  );
}
