import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import DataTable from "../../components/tables/DataTable";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import RoleForm from "./RoleForm";
import { createRole, fetchRoles, removeRole, updateRole } from "../../store/slices/roleSlice";
import { permissionService } from "../../services/permissionService";
import { roleService } from "../../services/roleService";
import { notify } from "../../utils/notify";

export default function RoleListPage() {
  const dispatch = useDispatch();
  const actor = useSelector((state) => state.auth.user);
  const { items, loading } = useSelector((state) => state.roles);
  const [catalog, setCatalog] = useState({ modules: [] });
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles());
    permissionService.getCatalog().then(setCatalog);
  }, [dispatch]);

  const save = async (payload) => {
    setSaving(true);
    try {
      const body = { ...payload, companyId: actor.companyId, isSystem: false };
      if (form?.id) {
        await dispatch(updateRole({ id: form.id, payload: body })).unwrap();
        notify.success("Role updated successfully");
      } else {
        await dispatch(createRole(body)).unwrap();
        notify.success("Role created successfully");
      }
      setForm(null);
    } catch (error) {
      notify.error(error.message || "Unable to save role");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Roles & permissions"
        description="Access is granted by permission keys, not by role name."
        actions={
          <PermissionGate permission="roles.create">
            <Button onClick={() => setForm({ permissions: [] })}>Create role</Button>
          </PermissionGate>
        }
      />
      <DataTable
        loading={loading}
        rows={items}
        searchable
        columns={[
          { key: "name", header: "Role" },
          { key: "description", header: "Description" },
          {
            key: "permissions",
            header: "Permissions",
            render: (row) => (row.permissions?.includes("*") ? "All" : row.permissions?.length || 0),
          },
          {
            key: "actions",
            header: "Actions",
            sortable: false,
            render: (row) => (
              <div className="flex gap-2">
                <PermissionGate permission="roles.edit">
                  <button className="text-primary" onClick={() => setForm(row)}>
                    Edit
                  </button>
                </PermissionGate>
                <PermissionGate permission="roles.create">
                  <button
                    className="text-primary"
                    onClick={async () => {
                      await roleService.duplicate(row.id);
                      dispatch(fetchRoles());
                      notify.success("Role duplicated");
                    }}
                  >
                    Duplicate
                  </button>
                </PermissionGate>
                <PermissionGate permission="roles.delete">
                  <button className="text-danger" disabled={row.isSystem} onClick={() => setRemoveId(row.id)}>
                    Delete
                  </button>
                </PermissionGate>
              </div>
            ),
          },
        ]}
      />
      <RoleForm open={form !== null} initial={form} catalog={catalog} saving={saving} onClose={() => setForm(null)} onSubmit={save} />
      <ConfirmDialog
        open={Boolean(removeId)}
        title="Delete role?"
        message="Users with this role will need a new role assigned."
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          await dispatch(removeRole(removeId));
          notify.success("Role deleted");
          setRemoveId(null);
        }}
      />
    </div>
  );
}
