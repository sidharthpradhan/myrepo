import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import Modal from "../../components/modals/Modal";
import Input from "../../components/forms/Input";
import Textarea from "../../components/forms/Textarea";
import LoadingButton from "../../components/common/LoadingButton";
import { announcementService } from "../../services/notificationService";
import { formatDateTime } from "../../utils/format";

export default function AnnouncementsPage() {
  const actor = useSelector((state) => state.auth.user);
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => setItems(await announcementService.getAll(actor));
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Announcements"
        description="Company and course notices. Ready to plug into a realtime channel later."
        actions={
          <PermissionGate permission="announcements.create">
            <Button onClick={() => setForm({})}>New announcement</Button>
          </PermissionGate>
        }
      />
      {items.map((item) => (
        <Card key={item.id} title={item.title}>
          <p className="text-sm">{item.body}</p>
          <p className="mt-2 text-xs text-muted">{formatDateTime(item.createdAt)}</p>
        </Card>
      ))}
      <Modal
        open={form !== null}
        title="New announcement"
        onClose={() => setForm(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setForm(null)}>Cancel</Button>
            <LoadingButton
              loading={saving}
              onClick={async () => {
                setSaving(true);
                await announcementService.create({
                  ...form,
                  companyId: actor.companyId,
                  authorId: actor.id,
                  createdAt: new Date().toISOString(),
                });
                setSaving(false);
                setForm(null);
                load();
              }}
            >
              Publish
            </LoadingButton>
          </div>
        }
      >
        {form ? (
          <div className="space-y-4">
            <Input label="Title" value={form.title || ""} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <Textarea label="Body" value={form.body || ""} onChange={(event) => setForm({ ...form, body: event.target.value })} />
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
