import { useEffect, useState } from "react";
import Input from "../../components/forms/Input";
import Select from "../../components/forms/Select";
import Textarea from "../../components/forms/Textarea";
import DatePicker from "../../components/forms/DatePicker";
import Button from "../../components/common/Button";
import LoadingButton from "../../components/common/LoadingButton";
import Modal from "../../components/modals/Modal";
import { COURSE_STATUSES, DIFFICULTIES } from "../../constants/app";

export default function CourseForm({ open, initial, users, saving, onClose, onSubmit }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm({
      title: "",
      description: "",
      thumbnail: "📘",
      category: "Frontend",
      instructorId: "",
      difficulty: "beginner",
      durationHours: 4,
      tags: "",
      skills: "",
      status: "draft",
      publishDate: "",
      expiryDate: "",
      modules: [],
      ...initial,
    });
  }, [initial, open]);

  if (!open) return null;
  const change = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal
      open={open}
      size="lg"
      title={initial?.id ? "Edit course" : "Create course"}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton loading={saving} onClick={() => onSubmit(form)}>
            Save changes
          </LoadingButton>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Title" value={form.title} onChange={(event) => change("title", event.target.value)} />
        <Input label="Category" value={form.category} onChange={(event) => change("category", event.target.value)} />
        <div className="sm:col-span-2">
          <Textarea label="Description" value={form.description} onChange={(event) => change("description", event.target.value)} />
        </div>
        <Input label="Thumbnail" value={form.thumbnail} onChange={(event) => change("thumbnail", event.target.value)} />
        <Select
          label="Instructor"
          value={form.instructorId || ""}
          onChange={(event) => change("instructorId", event.target.value)}
          options={[{ value: "", label: "Select" }, ...users.map((user) => ({ value: user.id, label: user.name }))]}
        />
        <Select
          label="Difficulty"
          value={form.difficulty}
          onChange={(event) => change("difficulty", event.target.value)}
          options={DIFFICULTIES.map((item) => ({ value: item, label: item }))}
        />
        <Input label="Duration (hours)" type="number" value={form.durationHours} onChange={(event) => change("durationHours", event.target.value)} />
        <Select
          label="Status"
          value={form.status}
          onChange={(event) => change("status", event.target.value)}
          options={COURSE_STATUSES.map((item) => ({ value: item, label: item }))}
        />
        <DatePicker label="Publish date" value={form.publishDate || ""} onChange={(event) => change("publishDate", event.target.value)} />
        <DatePicker label="Expiry date" value={form.expiryDate || ""} onChange={(event) => change("expiryDate", event.target.value)} />
        <Input label="Tags" value={form.tags} onChange={(event) => change("tags", event.target.value)} />
        <Input label="Skills" value={form.skills} onChange={(event) => change("skills", event.target.value)} />
      </div>
    </Modal>
  );
}
