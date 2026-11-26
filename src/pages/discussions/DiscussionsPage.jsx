import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { discussionService } from "../../services/notificationService";
import { userService } from "../../services/userService";
import { formatDateTime } from "../../utils/format";
import { notify } from "../../utils/notify";

export default function DiscussionsPage() {
  const actor = useSelector((state) => state.auth.user);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [draft, setDraft] = useState("");
  const [reply, setReply] = useState({});

  const load = async () => {
    setItems(await discussionService.getAll(actor));
    setUsers(await userService.getUsers(actor));
  };

  useEffect(() => {
    load();
  }, []);

  const name = (id) => users.find((user) => user.id === id)?.name || "Member";

  return (
    <div className="space-y-4">
      <PageHeader title="Discussions" description="Threaded comments. Swap this service for websockets later without changing the UI." />
      <Card title="Start a thread">
        <textarea className="w-full rounded-lg border border-border bg-app p-3 text-sm" rows={3} value={draft} onChange={(event) => setDraft(event.target.value)} />
        <Button
          className="mt-2"
          onClick={async () => {
            await discussionService.create({
              companyId: actor.companyId,
              courseId: null,
              title: draft.slice(0, 48) || "New discussion",
              authorId: actor.id,
              createdAt: new Date().toISOString(),
              comments: [],
            });
            setDraft("");
            notify.success("Discussion posted");
            load();
          }}
        >
          Post
        </Button>
      </Card>
      {items.map((thread) => (
        <Card key={thread.id} title={thread.title}>
          <p className="text-xs text-muted">
            {name(thread.authorId)} · {formatDateTime(thread.createdAt)}
          </p>
          <div className="mt-3 space-y-3">
            {(thread.comments || []).map((comment) => (
              <div key={comment.id} className="rounded-xl bg-raised p-3 text-sm">
                <p className="font-medium">{name(comment.authorId)}</p>
                <p>{comment.body}</p>
                {(comment.replies || []).map((item) => (
                  <p key={item.id} className="mt-2 ml-4 text-muted">
                    {name(item.authorId)}: {item.body}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              className="h-10 flex-1 rounded-lg border border-border bg-surface px-3 text-sm"
              placeholder="Write a comment"
              value={reply[thread.id] || ""}
              onChange={(event) => setReply({ ...reply, [thread.id]: event.target.value })}
            />
            <Button
              variant="secondary"
              onClick={async () => {
                const comments = [
                  ...(thread.comments || []),
                  {
                    id: `c${Date.now()}`,
                    authorId: actor.id,
                    body: reply[thread.id],
                    createdAt: new Date().toISOString(),
                    replies: [],
                  },
                ];
                await discussionService.update(thread.id, { comments });
                setReply({ ...reply, [thread.id]: "" });
                load();
              }}
            >
              Reply
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
