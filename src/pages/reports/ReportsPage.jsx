import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import PermissionGate from "../../components/common/PermissionGate";
import DataTable from "../../components/tables/DataTable";
import Select from "../../components/forms/Select";
import DatePicker from "../../components/forms/DatePicker";
import { reportService } from "../../services/reportService";
import { exportCsv } from "../../utils/exportCsv";
import { notify } from "../../utils/notify";

export default function ReportsPage() {
  const actor = useSelector((state) => state.auth.user);
  const [catalog, setCatalog] = useState([]);
  const [tables, setTables] = useState({});
  const [reportId, setReportId] = useState("user-progress");
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([reportService.getCatalog(), reportService.getTables(actor)]).then(([list, data]) => {
      setCatalog(list);
      setTables(data);
      setLoading(false);
    });
  }, [actor]);

  const rows = useMemo(() => {
    const source = tables[reportId] || [];
    return source.filter((row) => {
      const matchesQuery = !query || Object.values(row).some((value) => String(value).toLowerCase().includes(query.toLowerCase()));
      const dateValue = row.takenAt || row.lastLogin || row.createdAt || row.issuedAt;
      const after = !from || !dateValue || String(dateValue).slice(0, 10) >= from;
      const before = !to || !dateValue || String(dateValue).slice(0, 10) <= to;
      return matchesQuery && after && before;
    });
  }, [tables, reportId, query, from, to]);

  const columns = rows[0]
    ? Object.keys(rows[0]).map((key) => ({ key, header: key }))
    : [{ key: "empty", header: "No columns" }];

  return (
    <div>
      <PageHeader
        title="Reports & analytics"
        description="Filter, export, and review learning performance."
        actions={
          <PermissionGate permission="reports.export">
            <Button
              onClick={() => {
                exportCsv(`${reportId}.csv`, rows);
                notify.success("Report exported");
              }}
            >
              Export / Download
            </Button>
          </PermissionGate>
        }
      />
      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <Select
          label="Report"
          value={reportId}
          onChange={(event) => setReportId(event.target.value)}
          options={catalog.map((item) => ({ value: item.id, label: item.name }))}
        />
        <InputLike label="Search" value={query} onChange={setQuery} />
        <DatePicker label="From" value={from} onChange={(event) => setFrom(event.target.value)} />
        <DatePicker label="To" value={to} onChange={(event) => setTo(event.target.value)} />
      </div>
      <DataTable loading={loading} rows={rows} columns={columns} emptyTitle="No report rows for this filter." />
    </div>
  );
}

function InputLike({ label, value, onChange }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
