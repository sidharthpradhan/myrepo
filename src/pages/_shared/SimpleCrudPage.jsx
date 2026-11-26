import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import DataTable from "../../components/tables/DataTable";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import Modal from "../../components/modals/Modal";
import Input from "../../components/forms/Input";
import Select from "../../components/forms/Select";
import Textarea from "../../components/forms/Textarea";
import LoadingButton from "../../components/common/LoadingButton";
import Badge, { statusTone } from "../../components/common/Badge";
import { notify } from "../../utils/notify";

export default function SimpleCrudPage({
  title,
  description,
  permission,
  selector,
  fetchAction,
  createAction,
  updateAction,
  removeAction,
  fields,
  extraColumns = [],
}) {
  const dispatch = useDispatch();
  const actor = useSelector((state) => state.auth.user);
  const slice = useSelector(selector);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  useEffect(() => {
    dispatch(fetchAction());
  }, [dispatch, fetchAction]);

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, companyId: form.companyId ?? actor.companyId };
      if (form.id) {
        await dispatch(updateAction({ id: form.id, payload })).unwrap();
        notify.success(`${title.slice(0, -1)} updated successfully`);
      } else {
        await dispatch(createAction(payload)).unwrap();
        notify.success(`${title.slice(0, -1)} created successfully`);
      }
      setForm(null);
    } catch (error) {
      notify.error(error.message || "Unable to save");
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    ...fields.filter((field) => field.list !== false).map((field) => ({ key: field.name, header: field.label })),
    ...extraColumns,
    {
      key: "status",
      header: "Status",
      render: (row) => (row.status ? <Badge tone={statusTone(row.status)}>{row.status}</Badge> : "—"),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (row) => (
        <div className="flex gap-2">
          <PermissionGate permission={`${permission}.edit`}>
            <button className="text-primary" onClick={() => setForm(row)}>
              Edit
            </button>
          </PermissionGate>
          <PermissionGate permission={`${permission}.delete`}>
            <button className="text-danger" onClick={() => setRemoveId(row.id)}>
              Delete
            </button>
          </PermissionGate>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={title}
        description={description}
        actions={
          <PermissionGate permission={`${permission}.create`}>
            <Button onClick={() => setForm({})}>Create</Button>
          </PermissionGate>
        }
      />
      <DataTable loading={slice.loading} rows={slice.items} searchable columns={columns} emptyTitle={`No ${title.toLowerCase()} found.`} />
      <Modal
        open={form !== null}
        title={form?.id ? "Edit" : "Create"}
        onClose={() => setForm(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setForm(null)}>
              Cancel
            </Button>
            <LoadingButton loading={saving} onClick={save}>
              Save changes
            </LoadingButton>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => {
            const value = form?.[field.name] ?? "";
            const onChange = (event) => setForm((current) => ({ ...current, [field.name]: event.target.value }));
            if (field.type === "textarea") {
              return <div key={field.name} className="sm:col-span-2"><Textarea label={field.label} value={value} onChange={onChange} /></div>;
            }
            if (field.type === "select") {
              return <Select key={field.name} label={field.label} value={value} onChange={onChange} options={field.options} />;
            }
            return <Input key={field.name} label={field.label} value={value} onChange={onChange} />;
          })}
        </div>
      </Modal>
      <ConfirmDialog
        open={Boolean(removeId)}
        title={`Delete ${title.slice(0, -1).toLowerCase()}?`}
        message="This cannot be undone in the current session."
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          await dispatch(removeAction(removeId));
          notify.success("Deleted");
          setRemoveId(null);
        }}
      />
    </div>
  );
}
