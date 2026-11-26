import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import { fetchUsers } from "../../store/slices/userSlice";
import { fetchLxp } from "../../store/slices/learningSlice";

export default function LeaderboardPage() {
  const dispatch = useDispatch();
  const actor = useSelector((state) => state.auth.user);
  const users = useSelector((state) => state.users.items);
  const badges = useSelector((state) => state.learning.lxp.badges);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchLxp());
  }, [dispatch]);

  const ranked = useMemo(
    () =>
      [...users]
        .filter((item) => actor.companyId == null || item.companyId === actor.companyId)
        .sort((a, b) => (b.points || 0) - (a.points || 0)),
    [users, actor],
  );

  return (
    <div className="space-y-4">
      <PageHeader title="Leaderboard" description="Points, levels, streaks, badges, and milestones." />
      <Card>
        <ol className="space-y-3">
          {ranked.map((user, index) => (
            <li key={user.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border px-3 py-2">
              <div>
                <p className="font-medium">
                  #{index + 1} {user.name}
                </p>
                <p className="text-xs text-muted">Level {user.level} · {user.streak} day streak</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {(user.badges || []).map((badge) => (
                  <Badge key={badge} tone="primary">
                    {badges.find((item) => item.id === badge)?.name || badge}
                  </Badge>
                ))}
                <span className="font-semibold text-primary">{user.points} pts</span>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
