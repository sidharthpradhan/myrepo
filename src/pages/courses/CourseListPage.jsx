import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import Badge, { statusTone } from "../../components/common/Badge";
import DataTable from "../../components/tables/DataTable";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import CourseForm from "./CourseForm";
import { createCourse, fetchCourses, removeCourse, updateCourse } from "../../store/slices/courseSlice";
import { fetchUsers } from "../../store/slices/userSlice";
import { courseService } from "../../services/courseService";
import { notify } from "../../utils/notify";
import { COURSE_STATUSES } from "../../constants/app";
import Select from "../../components/forms/Select";

export default function CourseListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.courses);
  const users = useSelector((state) => state.users.items);
  const actor = useSelector((state) => state.auth.user);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [removeId, setRemoveId] = useState(null);
  const [status, setStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchUsers());
  }, [dispatch]);

  const rows = items.filter((item) => status === "all" || item.status === status);

  const save = async (payload) => {
    setSaving(true);
    try {
      const body = {
        ...payload,
        companyId: actor.companyId,
        instructorId: payload.instructorId ? Number(payload.instructorId) : null,
        durationHours: Number(payload.durationHours) || 0,
        tags: String(payload.tags || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        skills: String(payload.skills || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        modules: payload.modules || [],
      };
      if (form?.id) {
        await dispatch(updateCourse({ id: form.id, payload: body })).unwrap();
        notify.success("Course updated successfully");
      } else {
        await dispatch(createCourse(body)).unwrap();
        notify.success("Course created successfully");
      }
      setForm(null);
    } catch (error) {
      notify.error(error.message || "Unable to save course");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Author, publish, and assign structured learning."
        actions={
          <PermissionGate permission="courses.create">
            <Button onClick={() => setForm({ status: "draft", difficulty: "beginner", modules: [] })}>Create course</Button>
          </PermissionGate>
        }
      />
      <DataTable
        loading={loading}
        rows={rows}
        searchable
        filters={
          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={[{ value: "all", label: "All statuses" }, ...COURSE_STATUSES.map((item) => ({ value: item, label: item }))]}
          />
        }
        columns={[
          { key: "title", header: "Title" },
          { key: "category", header: "Category" },
          { key: "difficulty", header: "Difficulty" },
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
              <div className="flex flex-wrap gap-2">
                <button className="text-primary" onClick={() => navigate(`/app/courses/${row.id}`)}>
                  View
                </button>
                <PermissionGate permission="courses.edit">
                  <button className="text-primary" onClick={() => setForm({ ...row, tags: row.tags?.join(", "), skills: row.skills?.join(", ") })}>
                    Edit
                  </button>
                </PermissionGate>
                <PermissionGate permission="courses.create">
                  <button
                    className="text-primary"
                    onClick={async () => {
                      await courseService.duplicate(row.id);
                      dispatch(fetchCourses());
                      notify.success("Course duplicated");
                    }}
                  >
                    Duplicate
                  </button>
                </PermissionGate>
                <PermissionGate permission="courses.publish">
                  <button
                    className="text-primary"
                    onClick={() =>
                      dispatch(
                        updateCourse({
                          id: row.id,
                          payload: { status: row.status === "published" ? "draft" : "published" },
                        }),
                      )
                    }
                  >
                    {row.status === "published" ? "Unpublish" : "Publish"}
                  </button>
                </PermissionGate>
                <PermissionGate permission="courses.edit">
                  <button className="text-primary" onClick={() => dispatch(updateCourse({ id: row.id, payload: { status: "archived" } }))}>
                    Archive
                  </button>
                </PermissionGate>
                <PermissionGate permission="courses.delete">
                  <button className="text-danger" onClick={() => setRemoveId(row.id)}>
                    Delete
                  </button>
                </PermissionGate>
              </div>
            ),
          },
        ]}
      />
      <CourseForm open={form !== null} initial={form} users={users} saving={saving} onClose={() => setForm(null)} onSubmit={save} />
      <ConfirmDialog
        open={Boolean(removeId)}
        title="Delete course?"
        message="Learners will lose access to this course in the mock store."
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          await dispatch(removeCourse(removeId));
          notify.success("Course deleted");
          setRemoveId(null);
        }}
      />
    </div>
  );
}
