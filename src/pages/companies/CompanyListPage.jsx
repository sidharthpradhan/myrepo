import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import Badge, { statusTone } from "../../components/common/Badge";
import DataTable from "../../components/tables/DataTable";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import CompanyForm from "./CompanyForm";
import { createCompany, fetchCompanies, removeCompany, updateCompany } from "../../store/slices/companySlice";
import { fetchUsers } from "../../store/slices/userSlice";
import { notify } from "../../utils/notify";

export default function CompanyListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((state) => state.companies);
  const users = useSelector((state) => state.users.items);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [removeId, setRemoveId] = useState(null);

  useEffect(() => {
    dispatch(fetchCompanies());
    dispatch(fetchUsers());
  }, [dispatch]);

  const save = async (payload) => {
    setSaving(true);
    try {
      if (form?.id) {
        await dispatch(updateCompany({ id: form.id, payload })).unwrap();
        notify.success("Company updated successfully");
      } else {
        await dispatch(createCompany(payload)).unwrap();
        notify.success("Company created successfully");
      }
      setForm(null);
    } catch (error) {
      notify.error(error.message || "Unable to save company");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    try {
      await dispatch(removeCompany(removeId)).unwrap();
      notify.success("Company deleted");
      setRemoveId(null);
    } catch (error) {
      notify.error(error.message || "Unable to delete company");
    }
  };

  return (
    <div>
      <PageHeader
        title="Companies"
        description="Create and isolate tenant organizations."
        actions={
          <PermissionGate permission="companies.create">
            <Button onClick={() => setForm({})}>Create company</Button>
          </PermissionGate>
        }
      />
      <DataTable
        loading={loading}
        rows={items}
        searchable
        columns={[
          { key: "name", header: "Company" },
          { key: "industry", header: "Industry" },
          { key: "timezone", header: "Timezone" },
          {
            key: "admin",
            header: "Company admin",
            getValue: (row) => users.find((user) => user.id === row.adminUserId)?.name || "Unassigned",
            render: (row) => users.find((user) => user.id === row.adminUserId)?.name || "Unassigned",
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
                <button className="text-primary" onClick={() => navigate(`/app/companies/${row.id}`)}>
                  View
                </button>
                <PermissionGate permission="companies.edit">
                  <button className="text-primary" onClick={() => setForm(row)}>
                    Edit
                  </button>
                </PermissionGate>
                <PermissionGate permission="companies.edit">
                  <button
                    className="text-primary"
                    onClick={() =>
                      dispatch(updateCompany({ id: row.id, payload: { status: row.status === "active" ? "inactive" : "active" } }))
                    }
                  >
                    {row.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </PermissionGate>
                <PermissionGate permission="companies.delete">
                  <button className="text-danger" onClick={() => setRemoveId(row.id)}>
                    Delete
                  </button>
                </PermissionGate>
              </div>
            ),
          },
        ]}
      />
      <CompanyForm open={form !== null} initial={form} users={users} onClose={() => setForm(null)} onSubmit={save} saving={saving} />
      <ConfirmDialog
        open={Boolean(removeId)}
        title="Delete company?"
        message="This removes the company from the mock store for this session."
        onClose={() => setRemoveId(null)}
        onConfirm={onDelete}
      />
    </div>
  );
}
