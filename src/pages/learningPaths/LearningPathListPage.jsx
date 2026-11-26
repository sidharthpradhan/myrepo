import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import DataTable from "../../components/tables/DataTable";
import Badge, { statusTone } from "../../components/common/Badge";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import Modal from "../../components/modals/Modal";
import Input from "../../components/forms/Input";
import Textarea from "../../components/forms/Textarea";
import Select from "../../components/forms/Select";
import LoadingButton from "../../components/common/LoadingButton";
import { learningPathService } from "../../services/learningPathService";
import { courseService } from "../../services/courseService";
import { notify } from "../../utils/notify";

export default function LearningPathListPage() {
  const actor = useSelector((state) => state.auth.user);
  const [items, setItems] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [removeId, setRemoveId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [paths, courseRows] = await Promise.all([learningPathService.getAll(actor), courseService.getAll(actor)]);
    setItems(paths);
    setCourses(courseRows);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        companyId: actor.companyId,
        courseIds: String(form.courseIds || "")
          .split(",")
          .map((item) => Number(item.trim()))
          .filter(Boolean),
        assignedUserIds: form.assignedUserIds || [],
      };
      if (form.id) await learningPathService.update(form.id, payload);
      else await learningPathService.create(payload);
      notify.success("Learning path saved");
      setForm(null);
      load();
    } catch (error) {
      notify.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Learning paths"
        description="Sequence courses, assessments, and certificates."
        actions={
          <PermissionGate permission="learningPaths.create">
            <Button onClick={() => setForm({ status: "draft", courseIds: "" })}>Create path</Button>
          </PermissionGate>
        }
      />
      <DataTable
        loading={loading}
        rows={items}
        searchable
        columns={[
          {
            key: "title",
            header: "Path",
            render: (row) => <Link className="text-primary" to={`/app/learning-paths/${row.id}`}>{row.title}</Link>,
          },
          { key: "skill", header: "Skill" },
          {
            key: "courses",
            header: "Courses",
            render: (row) => row.courseIds?.length || 0,
          },
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
                <PermissionGate permission="learningPaths.edit">
                  <button className="text-primary" onClick={() => setForm({ ...row, courseIds: row.courseIds.join(",") })}>
                    Edit
                  </button>
                </PermissionGate>
                <PermissionGate permission="learningPaths.delete">
                  <button className="text-danger" onClick={() => setRemoveId(row.id)}>
                    Delete
                  </button>
                </PermissionGate>
              </div>
            ),
          },
        ]}
      />
      <Modal
        open={form !== null}
        title={form?.id ? "Edit path" : "Create path"}
        onClose={() => setForm(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setForm(null)}>Cancel</Button>
            <LoadingButton loading={saving} onClick={save}>Save changes</LoadingButton>
          </div>
        }
      >
        {form ? (
          <div className="grid gap-4">
            <Input label="Title" value={form.title || ""} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <Textarea label="Description" value={form.description || ""} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <Input label="Skill" value={form.skill || ""} onChange={(event) => setForm({ ...form, skill: event.target.value })} />
            <Select
              label="Status"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
              options={[{ value: "draft", label: "draft" }, { value: "published", label: "published" }]}
            />
            <Input
              label="Course IDs in order (comma separated)"
              value={form.courseIds || ""}
              onChange={(event) => setForm({ ...form, courseIds: event.target.value })}
            />
            <p className="text-xs text-muted">Available: {courses.map((item) => `${item.id} ${item.title}`).join(" · ")}</p>
          </div>
        ) : null}
      </Modal>
      <ConfirmDialog
        open={Boolean(removeId)}
        title="Delete learning path?"
        message="Assigned learners will lose this sequence."
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          await learningPathService.remove(removeId);
          notify.success("Path deleted");
          setRemoveId(null);
          load();
        }}
      />
    </div>
  );
}
