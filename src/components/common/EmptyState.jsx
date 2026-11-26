export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <p className="text-base font-semibold">{title}</p>
      {description ? <p className="mt-1 max-w-md text-sm text-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong.", onRetry }) {
  return (
    <EmptyState
      title={title}
      description="Please try again. If this continues, check the mock service or refresh the page."
      action={
        onRetry ? (
          <button type="button" onClick={onRetry} className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
            Try again
          </button>
        ) : null
      }
    />
  );
}
