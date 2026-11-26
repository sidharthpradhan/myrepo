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
import Select from "../../components/forms/Select";
import LoadingButton from "../../components/common/LoadingButton";
import { assessmentService } from "../../services/assessmentService";
import { notify } from "../../utils/notify";

export default function AssessmentListPage() {
  const actor = useSelector((state) => state.auth.user);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  const load = async () => {
    setLoading(true);
    setItems(await assessmentService.getAll(actor));
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
        passingScore: Number(form.passingScore) || 70,
        timeLimitMinutes: Number(form.timeLimitMinutes) || 20,
        attempts: Number(form.attempts) || 1,
        questions: form.questions || [],
      };
      if (form.id) await assessmentService.update(form.id, payload);
      else await assessmentService.create(payload);
      notify.success("Assessment saved");
      setForm(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Assessments"
        description="Quizzes and path assessments with a shared question bank."
        actions={
          <PermissionGate permission="assessments.create">
            <Button onClick={() => setForm({ status: "draft", type: "quiz", questions: [] })}>Create assessment</Button>
          </PermissionGate>
        }
      />
      <DataTable
        loading={loading}
        rows={items}
        searchable
        columns={[
          { key: "title", header: "Title" },
          { key: "type", header: "Type" },
          { key: "passingScore", header: "Pass score" },
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
                <Link className="text-primary" to={`/app/assessments/${row.id}`}>
                  View
                </Link>
                <Link className="text-primary" to={`/app/assessments/${row.id}/take`}>
                  Take
                </Link>
                <PermissionGate permission="assessments.delete">
                  <button className="text-danger" onClick={() => setRemoveId(row.id)}>Delete</button>
                </PermissionGate>
              </div>
            ),
          },
        ]}
      />
      <Modal
        open={form !== null}
        title="Create assessment"
        onClose={() => setForm(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setForm(null)}>Cancel</Button>
            <LoadingButton loading={saving} onClick={save}>Save changes</LoadingButton>
          </div>
        }
      >
        {form ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" value={form.title || ""} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <Select
              label="Type"
              value={form.type}
              onChange={(event) => setForm({ ...form, type: event.target.value })}
              options={[{ value: "quiz", label: "quiz" }, { value: "assessment", label: "assessment" }]}
            />
            <Input label="Passing score" type="number" value={form.passingScore || 70} onChange={(event) => setForm({ ...form, passingScore: event.target.value })} />
            <Input label="Time limit (min)" type="number" value={form.timeLimitMinutes || 20} onChange={(event) => setForm({ ...form, timeLimitMinutes: event.target.value })} />
            <Input label="Attempts" type="number" value={form.attempts || 2} onChange={(event) => setForm({ ...form, attempts: event.target.value })} />
            <Select
              label="Status"
              value={form.status}
              onChange={(event) => setForm({ ...form, status: event.target.value })}
              options={[{ value: "draft", label: "draft" }, { value: "published", label: "published" }]}
            />
          </div>
        ) : null}
      </Modal>
      <ConfirmDialog
        open={Boolean(removeId)}
        title="Delete assessment?"
        message="Question history stays in the mock results table."
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          await assessmentService.remove(removeId);
          setRemoveId(null);
          load();
        }}
      />
    </div>
  );
}
