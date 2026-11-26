export const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

export function copy(value) {
  return JSON.parse(JSON.stringify(value));
}

export function nextId(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

export function byCompany(items, actor) {
  if (!actor || actor.companyId == null) return copy(items);
  return copy(items.filter((item) => item.companyId === actor.companyId));
}

export function paginate(items, page = 1, pageSize = 8) {
  const start = (page - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}

export function matchesQuery(item, query, fields) {
  if (!query) return true;
  const q = query.toLowerCase();
  return fields.some((field) => String(item[field] || "").toLowerCase().includes(q));
}
