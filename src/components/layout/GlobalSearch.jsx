import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { STORAGE_KEYS } from "../../constants/app";
import { useDebounce } from "../../hooks/useDebounce";
import { searchService } from "../../services/searchService";
import SearchInput from "../forms/SearchInput";

export default function GlobalSearch() {
  const user = useSelector((state) => state.auth.user);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [results, setResults] = useState([]);
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.recentSearches) || "[]");
    } catch {
      return [];
    }
  });
  const debounced = useDebounce(query);
  const navigate = useNavigate();
  const boxRef = useRef(null);

  useEffect(() => {
    const onClick = (event) => {
      if (!boxRef.current?.contains(event.target)) setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    let active = true;
    if (!debounced) {
      setResults([]);
      return undefined;
    }
    searchService.search(debounced, user).then((items) => {
      if (active) setResults(items);
    });
    return () => {
      active = false;
    };
  }, [debounced, user]);

  const visible = filter === "All" ? results : results.filter((item) => item.type === filter);
  const types = ["All", ...new Set(results.map((item) => item.type))];

  const go = (item) => {
    const nextRecent = [item.title, ...recent.filter((value) => value !== item.title)].slice(0, 6);
    setRecent(nextRecent);
    localStorage.setItem(STORAGE_KEYS.recentSearches, JSON.stringify(nextRecent));
    setOpen(false);
    setQuery("");
    navigate(item.path);
  };

  return (
    <div className="relative w-full max-w-xl" ref={boxRef}>
      <SearchInput
        value={query}
        placeholder="Search users, courses, paths..."
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
      />
      {open ? (
        <div className="absolute z-40 mt-2 w-full rounded-xl border border-border bg-surface p-2 shadow-xl">
          {query ? (
            <>
              <div className="mb-2 flex flex-wrap gap-1">
                {types.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFilter(type)}
                    className={`rounded-full px-2 py-1 text-xs ${filter === type ? "bg-primary text-white" : "bg-raised"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {visible.length === 0 ? (
                <p className="px-2 py-4 text-sm text-muted">No results found. Try changing your search or filters.</p>
              ) : (
                visible.map((item) => (
                  <button
                    key={`${item.type}-${item.id}`}
                    type="button"
                    onClick={() => go(item)}
                    className="flex w-full flex-col rounded-lg px-3 py-2 text-left hover:bg-primary-soft"
                  >
                    <span className="text-sm font-medium">{item.title}</span>
                    <span className="text-xs text-muted">
                      {item.type} · {item.subtitle}
                    </span>
                  </button>
                ))
              )}
            </>
          ) : (
            <div className="px-2 py-2">
              <p className="text-xs font-semibold uppercase text-muted">Recent searches</p>
              {recent.length === 0 ? (
                <p className="py-3 text-sm text-muted">Start typing to search the workspace.</p>
              ) : (
                recent.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setQuery(item)}
                    className="mt-1 block w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-primary-soft"
                  >
                    {item}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
