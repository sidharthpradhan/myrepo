import SimpleCrudPage from "../_shared/SimpleCrudPage";
import { createDepartment, fetchDepartments, removeDepartment, updateDepartment } from "../../store/slices/departmentSlice";

export default function DepartmentListPage() {
  return (
    <SimpleCrudPage
      title="Departments"
      description="Group people by function and assign a manager."
      permission="departments"
      selector={(state) => state.departments}
      fetchAction={fetchDepartments}
      createAction={createDepartment}
      updateAction={updateDepartment}
      removeAction={removeDepartment}
      fields={[
        { name: "name", label: "Name" },
        { name: "code", label: "Code" },
        { name: "description", label: "Description", type: "textarea" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "active", label: "active" },
            { value: "inactive", label: "inactive" },
          ],
        },
      ]}
    />
  );
}
