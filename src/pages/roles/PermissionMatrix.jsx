export default function PermissionMatrix({ catalog, value = [], onChange }) {
  const keysFor = (module) => module.actions.map((action) => `${module.id}.${action}`);
  const allKeys = catalog.modules.flatMap(keysFor);
  const toggle = (key, checked) => {
    const next = new Set(value);
    if (checked) next.add(key);
    else next.delete(key);
    onChange([...next]);
  };
  const setMany = (keys, checked) => {
    const next = new Set(value);
    keys.forEach((key) => (checked ? next.add(key) : next.delete(key)));
    onChange([...next]);
  };

  if (value.includes("*")) {
    return (
      <p className="rounded-xl bg-raised p-4 text-sm">
        This role has full access (<code>*</code>). Clear that flag to assign individual permissions.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" className="text-sm text-primary" onClick={() => onChange(allKeys)}>
          Select all
        </button>
        <button type="button" className="text-sm text-primary" onClick={() => onChange([])}>
          Clear all
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-raised">
            <tr>
              <th className="px-3 py-2">Module</th>
              {["view", "create", "edit", "delete", "export", "import", "assign", "publish", "approve", "manage", "invite"].map(
                (action) => (
                  <th key={action} className="px-3 py-2 capitalize">
                    {action}
                  </th>
                ),
              )}
              <th className="px-3 py-2">All</th>
            </tr>
          </thead>
          <tbody>
            {catalog.modules.map((module) => {
              const keys = keysFor(module);
              const allOn = keys.every((key) => value.includes(key));
              return (
                <tr key={module.id} className="border-t border-border">
                  <td className="px-3 py-2 font-medium">{module.name}</td>
                  {["view", "create", "edit", "delete", "export", "import", "assign", "publish", "approve", "manage", "invite"].map(
                    (action) => {
                      const key = `${module.id}.${action}`;
                      const exists = module.actions.includes(action);
                      return (
                        <td key={action} className="px-3 py-2">
                          {exists ? (
                            <input type="checkbox" checked={value.includes(key)} onChange={(event) => toggle(key, event.target.checked)} />
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                      );
                    },
                  )}
                  <td className="px-3 py-2">
                    <input type="checkbox" checked={allOn} onChange={(event) => setMany(keys, event.target.checked)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
