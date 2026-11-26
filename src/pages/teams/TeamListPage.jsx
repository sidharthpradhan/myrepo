import SimpleCrudPage from "../_shared/SimpleCrudPage";
import { createTeam, fetchTeams, removeTeam, updateTeam } from "../../store/slices/teamSlice";

export default function TeamListPage() {
  return (
    <SimpleCrudPage
      title="Teams"
      description="Smaller groups with a team leader and members."
      permission="teams"
      selector={(state) => state.teams}
      fetchAction={fetchTeams}
      createAction={createTeam}
      updateAction={updateTeam}
      removeAction={removeTeam}
      fields={[
        { name: "name", label: "Name" },
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
