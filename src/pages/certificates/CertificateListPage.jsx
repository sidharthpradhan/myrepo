import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import DataTable from "../../components/tables/DataTable";
import ConfirmDialog from "../../components/modals/ConfirmDialog";
import { certificateService } from "../../services/certificateService";
import { userService } from "../../services/userService";
import { exportCsv } from "../../utils/exportCsv";
import { notify } from "../../utils/notify";

export default function CertificateListPage() {
  const actor = useSelector((state) => state.auth.user);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verify, setVerify] = useState("");
  const [removeId, setRemoveId] = useState(null);

  const load = async () => {
    setLoading(true);
    setItems(await certificateService.getAll(actor));
    setUsers(await userService.getUsers(actor));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <PageHeader
        title="Certificates"
        description="Issue, download, and verify completion records."
        actions={
          <>
            <PermissionGate permission="certificates.export">
              <Button variant="secondary" onClick={() => exportCsv("certificates.csv", items)}>Export</Button>
            </PermissionGate>
            <PermissionGate permission="certificates.manage">
              <Button
                onClick={async () => {
                  await certificateService.issue({
                    companyId: actor.companyId,
                    userId: actor.id,
                    templateName: "Manual issue",
                    prefix: "SKL",
                    status: "issued",
                  });
                  notify.success("Certificate issued");
                  load();
                }}
              >
                Issue certificate
              </Button>
            </PermissionGate>
          </>
        }
      />
      <div className="mb-4 flex flex-col gap-2 rounded-2xl border border-border bg-surface p-4 sm:flex-row">
        <input
          className="h-10 flex-1 rounded-lg border border-border bg-app px-3 text-sm"
          placeholder="Verify certificate number"
          value={verify}
          onChange={(event) => setVerify(event.target.value)}
        />
        <Button
          variant="secondary"
          onClick={async () => {
            const found = await certificateService.verify(verify);
            if (found) notify.success(`Valid: ${found.certificateNumber}`);
            else notify.error("Certificate not found");
          }}
        >
          Verify
        </Button>
      </div>
      <DataTable
        loading={loading}
        rows={items}
        searchable
        columns={[
          { key: "certificateNumber", header: "Number" },
          {
            key: "user",
            header: "Learner",
            render: (row) => users.find((user) => user.id === row.userId)?.name || row.userId,
          },
          { key: "templateName", header: "Template" },
          { key: "issuedAt", header: "Issued" },
          { key: "status", header: "Status" },
          {
            key: "actions",
            header: "Actions",
            sortable: false,
            render: (row) => (
              <div className="flex gap-2">
                <button
                  className="text-primary"
                  onClick={() => notify.info(`Mock download for ${row.certificateNumber}`)}
                >
                  Download
                </button>
                <PermissionGate permission="certificates.delete">
                  <button className="text-danger" onClick={() => setRemoveId(row.id)}>Delete</button>
                </PermissionGate>
              </div>
            ),
          },
        ]}
      />
      <ConfirmDialog
        open={Boolean(removeId)}
        title="Delete certificate?"
        message="The number will no longer verify."
        onClose={() => setRemoveId(null)}
        onConfirm={async () => {
          await certificateService.remove(removeId);
          setRemoveId(null);
          load();
        }}
      />
    </div>
  );
}
