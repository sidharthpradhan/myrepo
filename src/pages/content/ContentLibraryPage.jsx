import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import DataTable from "../../components/tables/DataTable";
import Badge, { statusTone } from "../../components/common/Badge";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import Modal from "../../components/modals/Modal";
import Input from "../../components/forms/Input";
import Select from "../../components/forms/Select";
import LoadingButton from "../../components/common/LoadingButton";
import { contentService } from "../../services/contentService";
import { notify } from "../../utils/notify";

const types = ["video", "pdf", "document", "audio", "presentation", "url"];

export default function ContentLibraryPage() {
  const actor = useSelector((state) => state.auth.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("all");
  const [form, setForm] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeId, setRemoveId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setItems(await contentService.getAll(actor));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const rows = items.filter((item) => type === "all" || item.type === type);

  return (
    <div>
      <PageHeader
        title="Content library"
        description="Reusable media referenced by courses. Uploads are mocked."
        actions={
          <PermissionGate permission="content.create">
            <Button onClick={() => setForm({ type: "video", status: "active" })}>Add content</Button>
          </PermissionGate>
        }
      />
      <DataTable
        loading={loading}
        rows={rows}
        searchable
        filters={
          <Select
            value={type}
            onChange={(event) => setType(event.target.value)}
            options={[{ value: "all", label: "All types" }, ...types.map((item) => ({ value: item, label: item }))]}
          />
        }
        columns={[
          { key: "title", header: "Title" },
          { key: "type", header: "Type" },
          { key: "category", header: "Category" },
          {
            key: "status",
            header: "Status",
            render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge>,
          },
          {
            key: "actions",
            header: "Actions",
            sortable: false,
            render: (row) => (
              <div className="flex gap-2">
                <button className="text-primary" onClick={() => setPreview(row)}>Preview</button>
                <PermissionGate permission="content.edit">
                  <button className="text-primary" onClick={() => setForm(row)}>Edit</button>
                </PermissionGate>
                <PermissionGate permission="content.delete">
                  <button className="text-danger" onClick={() => setRemoveId(row.id)}>Archive</button>
                </PermissionGate>
              </div>
            ),
          },
        ]}
      />
      <Modal open={Boolean(preview)} title={preview?.title} onClose={() => setPreview(null)}>
        <p className="text-sm text-muted">{preview?.type} · {preview?.url}</p>
        <div className="mt-4 rounded-xl bg-raised p-8 text-center text-sm text-muted">Mock preview surface</div>
      </Modal>
      <Modal
        open={form !== null}
        title={form?.id ? "Edit content" : "Add content"}
        onClose={() => setForm(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setForm(null)}>Cancel</Button>
            <LoadingButton
              loading={saving}
              onClick={async () => {
                setSaving(true);
                const payload = { ...form, companyId: actor.companyId, createdAt: form.createdAt || new Date().toISOString().slice(0, 10) };
                if (form.id) await contentService.update(form.id, payload);
                else await contentService.create(payload);
                notify.success("Content saved");
                setSaving(false);
                setForm(null);
                load();
              }}
            >
              Save changes
            </LoadingButton>
          </div>
        }
      >
        {form ? (
          <div className="grid gap-4">
            <Input label="Title" value={form.title || ""} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <Select label="Type" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} options={types.map((item) => ({ value: item, label: item }))} />
            <Input label="Category" value={form.category || ""} onChange={(event) => setForm({ ...form, category: event.target.value })} />
            <Input label="URL" value={form.url || ""} onChange={(event) => setForm({ ...form, url: event.target.value })} />
          </div>
        ) : null}
      </Modal>
      <ConfirmDialog
        open={Boolean(removeId)}
        title="Archive content?"
        message="The item is removed from the mock library."
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          await contentService.update(removeId, { status: "archived" });
          setRemoveId(null);
          load();
        }}
      />
    </div>
  );
}
