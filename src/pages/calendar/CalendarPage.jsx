import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import Card from "../../components/common/Card";
import Modal from "../../components/modals/Modal";
import Input from "../../components/forms/Input";
import Select from "../../components/forms/Select";
import DatePicker from "../../components/forms/DatePicker";
import LoadingButton from "../../components/common/LoadingButton";
import { calendarService } from "../../services/notificationService";

const views = [
  { id: "month", label: "Month" },
  { id: "week", label: "Week" },
  { id: "day", label: "Day" },
];

function startOfWeek(date) {
  const next = new Date(date);
  const day = next.getDay();
  next.setDate(next.getDate() - day);
  next.setHours(0, 0, 0, 0);
  return next;
}

export default function CalendarPage() {
  const actor = useSelector((state) => state.auth.user);
  const [events, setEvents] = useState([]);
  const [cursor, setCursor] = useState(new Date("2026-09-18"));
  const [view, setView] = useState("month");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => setEvents(await calendarService.getAll(actor));

  useEffect(() => {
    load();
  }, []);

  const days = useMemo(() => {
    if (view === "day") return [new Date(cursor)];
    if (view === "week") {
      const start = startOfWeek(cursor);
      return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        return date;
      });
    }
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const start = startOfWeek(first);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [cursor, view]);

  const key = (date) => date.toISOString().slice(0, 10);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Calendar"
        description="Training sessions, assessments, deadlines, and reminders."
        actions={
          <PermissionGate permission="calendar.create">
            <Button onClick={() => setForm({ date: key(cursor), type: "event", start: "09:00", end: "10:00" })}>Add event</Button>
          </PermissionGate>
        }
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}>
          Prev
        </Button>
        <Button variant="secondary" onClick={() => setCursor(new Date())}>
          Today
        </Button>
        <Button variant="secondary" onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}>
          Next
        </Button>
        <div className="ml-auto flex gap-1 rounded-xl bg-raised p-1">
          {views.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              className={`rounded-lg px-3 py-1 text-sm ${view === item.id ? "bg-surface text-primary" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className={`grid gap-2 ${view === "month" ? "grid-cols-2 sm:grid-cols-7" : view === "week" ? "grid-cols-1 sm:grid-cols-7" : "grid-cols-1"}`}>
        {days.map((date) => {
          const id = key(date);
          const dayEvents = events.filter((item) => item.date === id);
          return (
            <Card key={id} className="min-h-28 p-3">
              <p className="text-xs text-muted">{date.toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</p>
              <div className="mt-2 space-y-1">
                {dayEvents.map((item) => (
                  <button key={item.id} type="button" className="block w-full rounded-md bg-primary-soft px-2 py-1 text-left text-xs text-primary" onClick={() => setForm(item)}>
                    {item.start} {item.title}
                  </button>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
      <Modal
        open={form !== null}
        title={form?.id ? "Edit event" : "Add event"}
        onClose={() => setForm(null)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setForm(null)}>Cancel</Button>
            <LoadingButton
              loading={saving}
              onClick={async () => {
                setSaving(true);
                const payload = { ...form, companyId: actor.companyId };
                if (form.id) await calendarService.update(form.id, payload);
                else await calendarService.create(payload);
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input label="Title" value={form.title || ""} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            </div>
            <Select
              label="Type"
              value={form.type}
              onChange={(event) => setForm({ ...form, type: event.target.value })}
              options={["training", "course", "assessment", "deadline", "event", "instructor-session", "reminder"].map((item) => ({ value: item, label: item }))}
            />
            <DatePicker label="Date" value={form.date || ""} onChange={(event) => setForm({ ...form, date: event.target.value })} />
            <Input label="Start" type="time" value={form.start || ""} onChange={(event) => setForm({ ...form, start: event.target.value })} />
            <Input label="End" type="time" value={form.end || ""} onChange={(event) => setForm({ ...form, end: event.target.value })} />
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
