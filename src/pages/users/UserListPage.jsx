import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import Badge, { statusTone } from "../../components/common/Badge";
import DataTable from "../../components/tables/DataTable";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import Select from "../../components/forms/Select";
import UserForm from "./UserForm";
import { createUser, fetchUsers, removeUser, updateUser } from "../../store/slices/userSlice";
import { fetchRoles } from "../../store/slices/roleSlice";
import { fetchDepartments } from "../../store/slices/departmentSlice";
import { fetchTeams } from "../../store/slices/teamSlice";
import { fetchCompanies } from "../../store/slices/companySlice";
import { userService } from "../../services/userService";
import { exportCsv } from "../../utils/exportCsv";
import { notify } from "../../utils/notify";
import { USER_STATUSES } from "../../constants/app";

export default function UserListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actor = useSelector((state) => state.auth.user);
  const { items, loading } = useSelector((state) => state.users);
  const roles = useSelector((state) => state.roles.items);
  const departments = useSelector((state) => state.departments.items);
  const teams = useSelector((state) => state.teams.items);
  const companies = useSelector((state) => state.companies.items);
  const [form, setForm] = useState(null);
  const [invite, setInvite] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removeId, setRemoveId] = useState(null);
  const [selected, setSelected] = useState([]);
  const [status, setStatus] = useState("all");
  const [roleId, setRoleId] = useState("all");

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
    dispatch(fetchDepartments());
    dispatch(fetchTeams());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const rows = useMemo(
    () =>
      items.filter((item) => {
        if (status !== "all" && item.status !== status) return false;
        if (roleId !== "all" && String(item.roleId) !== roleId) return false;
        return true;
      }),
    [items, status, roleId],
  );

  const save = async (payload) => {
    setSaving(true);
    try {
      const body = {
        ...payload,
        companyId: payload.companyId ? Number(payload.companyId) : actor.companyId,
        roleId: Number(payload.roleId),
        departmentId: payload.departmentId ? Number(payload.departmentId) : null,
        teamId: payload.teamId ? Number(payload.teamId) : null,
      };
      if (form?.id) {
        await dispatch(updateUser({ id: form.id, payload: body })).unwrap();
        notify.success("User updated successfully");
      } else if (invite) {
        await userService.inviteUser(body);
        await dispatch(fetchUsers());
        notify.success("Invite sent");
      } else {
        await dispatch(createUser(body)).unwrap();
        notify.success("User created successfully");
      }
      setForm(null);
      setInvite(false);
    } catch (error) {
      notify.error(error.message || "Unable to save user");
    } finally {
      setSaving(false);
    }
  };

  const bulkStatus = async (nextStatus) => {
    await Promise.all(selected.map((id) => dispatch(updateUser({ id, payload: { status: nextStatus } }))));
    notify.success("Bulk update complete");
    setSelected([]);
  };

  return (
    <div>
      <PageHeader
        title="Users"
        description="People, roles, departments, and teams for the current company scope."
        actions={
          <>
            <PermissionGate permission="users.export">
              <Button variant="secondary" onClick={() => exportCsv("users.csv", rows)}>
                Export
              </Button>
            </PermissionGate>
            <PermissionGate permission="users.invite">
              <Button variant="secondary" onClick={() => { setInvite(true); setForm({}); }}>
                Invite user
              </Button>
            </PermissionGate>
            <PermissionGate permission="users.create">
              <Button onClick={() => { setInvite(false); setForm({}); }}>Add user</Button>
            </PermissionGate>
          </>
        }
      />
      {selected.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2 rounded-xl border border-border bg-surface p-3 text-sm">
          <span>{selected.length} selected</span>
          <PermissionGate permission="users.edit">
            <Button size="sm" variant="secondary" onClick={() => bulkStatus("inactive")}>
              Deactivate
            </Button>
            <Button size="sm" variant="secondary" onClick={() => bulkStatus("active")}>
              Activate
            </Button>
          </PermissionGate>
        </div>
      ) : null}
      <DataTable
        loading={loading}
        rows={rows}
        searchable
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        emptyTitle="No users found."
        emptyAction={
          <PermissionGate permission="users.create">
            <Button onClick={() => setForm({})}>Add user</Button>
          </PermissionGate>
        }
        filters={
          <div className="flex gap-2">
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              options={[{ value: "all", label: "All statuses" }, ...USER_STATUSES.map((item) => ({ value: item, label: item }))]}
            />
            <Select
              value={roleId}
              onChange={(event) => setRoleId(event.target.value)}
              options={[{ value: "all", label: "All roles" }, ...roles.map((item) => ({ value: item.id, label: item.name }))]}
            />
          </div>
        }
        columns={[
          { key: "name", header: "Name" },
          { key: "email", header: "Email" },
          {
            key: "role",
            header: "Role",
            getValue: (row) => roles.find((item) => item.id === row.roleId)?.name,
            render: (row) => roles.find((item) => item.id === row.roleId)?.name || "—",
          },
          {
            key: "department",
            header: "Department",
            getValue: (row) => departments.find((item) => item.id === row.departmentId)?.name,
            render: (row) => departments.find((item) => item.id === row.departmentId)?.name || "—",
          },
          {
            key: "team",
            header: "Team",
            getValue: (row) => teams.find((item) => item.id === row.teamId)?.name,
            render: (row) => teams.find((item) => item.id === row.teamId)?.name || "—",
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
                <button className="text-primary" onClick={() => navigate(`/app/users/${row.id}`)}>
                  View
                </button>
                <PermissionGate permission="users.edit">
                  <button className="text-primary" onClick={() => setForm(row)}>
                    Edit
                  </button>
                </PermissionGate>
                <PermissionGate permission="users.delete">
                  <button className="text-danger" onClick={() => setRemoveId(row.id)}>
                    Delete
                  </button>
                </PermissionGate>
              </div>
            ),
          },
        ]}
      />
      <UserForm
        open={form !== null}
        initial={form}
        invite={invite}
        actor={actor}
        roles={roles}
        departments={departments}
        teams={teams}
        companies={companies}
        saving={saving}
        onClose={() => setForm(null)}
        onSubmit={save}
      />
      <ConfirmDialog
        open={Boolean(removeId)}
        title="Delete user?"
        message="Are you sure you want to delete this user?"
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          await dispatch(removeUser(removeId));
          notify.success("User deleted");
          setRemoveId(null);
        }}
      />
    </div>
  );
}
