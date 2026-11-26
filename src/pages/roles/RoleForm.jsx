import { useEffect, useState } from "react";
import Input from "../../components/forms/Input";
import Textarea from "../../components/forms/Textarea";
import Button from "../../components/common/Button";
import LoadingButton from "../../components/common/LoadingButton";
import Modal from "../../components/modals/Modal";
import PermissionMatrix from "./PermissionMatrix";

export default function RoleForm({ open, initial, catalog, saving, onClose, onSubmit }) {
  const [form, setForm] = useState({ name: "", description: "", permissions: [] });

  useEffect(() => {
    setForm({
      name: "",
      description: "",
      permissions: [],
      ...initial,
    });
  }, [initial, open]);

  if (!open) return null;

  return (
    <Modal
      open={open}
      title={initial?.id ? "Edit role" : "Create role"}
      size="xl"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton loading={saving} onClick={() => onSubmit(form)}>
            Save role
          </LoadingButton>
        </div>
      }
    >
      <div className="space-y-4">
        <Input label="Role name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
        <Textarea
          label="Description"
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
        />
        <PermissionMatrix
          catalog={catalog}
          value={form.permissions || []}
          onChange={(permissions) => setForm((current) => ({ ...current, permissions }))}
        />
      </div>
    </Modal>
  );
}
