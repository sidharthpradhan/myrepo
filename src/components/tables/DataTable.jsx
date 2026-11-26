import { useMemo, useState } from "react";
import { PAGE_SIZE } from "../../constants/app";
import EmptyState from "../common/EmptyState";
import Pagination from "../common/Pagination";
import { SkeletonTable } from "../common/Skeleton";

export default function DataTable({
  columns,
  rows,
  loading,
  rowKey = "id",
  searchable,
  searchPlaceholder = "Search",
  filters,
  selectable,
  selected = [],
  onSelectedChange,
  emptyTitle = "No records found.",
  emptyDescription = "Try changing your search or filters.",
  emptyAction,
}) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let next = rows || [];
    if (query) {
      const q = query.toLowerCase();
      next = next.filter((row) =>
        columns.some((column) => String(column.getValue ? column.getValue(row) : row[column.key] ?? "").toLowerCase().includes(q)),
      );
    }
    if (sortKey) {
      next = [...next].sort((a, b) => {
        const column = columns.find((item) => item.key === sortKey);
        const av = column?.getValue ? column.getValue(a) : a[sortKey];
        const bv = column?.getValue ? column.getValue(b) : b[sortKey];
        return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return next;
  }, [rows, query, sortKey, sortDir, columns]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleAll = (checked) => {
    onSelectedChange?.(checked ? paged.map((row) => row[rowKey]) : []);
  };

  const toggleOne = (id) => {
    const set = new Set(selected);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onSelectedChange?.([...set]);
  };

  const onSort = (key, sortable) => {
    if (!sortable) return;
    if (sortKey === key) setSortDir((value) => (value === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <div className="space-y-3">
      {(searchable || filters) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {searchable ? (
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:ring-2 focus:ring-primary sm:max-w-xs"
            />
          ) : (
            <span />
          )}
          {filters}
        </div>
      )}

      {loading ? (
        <SkeletonTable />
      ) : filtered.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-raised text-muted">
                <tr>
                  {selectable ? (
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={paged.length > 0 && paged.every((row) => selected.includes(row[rowKey]))}
                        onChange={(event) => toggleAll(event.target.checked)}
                      />
                    </th>
                  ) : null}
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="cursor-pointer whitespace-nowrap px-4 py-3 font-medium"
                      onClick={() => onSort(column.key, column.sortable !== false)}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => (
                  <tr key={row[rowKey]} className="border-t border-border hover:bg-primary-soft/40">
                    {selectable ? (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.includes(row[rowKey])}
                          onChange={() => toggleOne(row[rowKey])}
                        />
                      </td>
                    ) : null}
                    {columns.map((column) => (
                      <td key={column.key} className="whitespace-nowrap px-4 py-3">
                        {column.render ? column.render(row) : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pageSize={PAGE_SIZE} total={filtered.length} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
