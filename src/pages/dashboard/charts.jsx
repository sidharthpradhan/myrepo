import { useSelector } from "react-redux";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import Card from "../../components/common/Card";

const tooltipStyle = {
  background: "var(--app-surface)",
  border: "1px solid var(--app-border)",
  color: "var(--app-text)",
};

export function LinePanel({ title, data, xKey, yKey }) {
  return (
    <Card title={title}>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey} stroke="var(--app-muted)" fontSize={12} />
            <YAxis stroke="var(--app-muted)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey={yKey} stroke="var(--app-primary)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function BarPanel({ title, data, xKey, yKey }) {
  return (
    <Card title={title}>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="var(--app-border)" strokeDasharray="3 3" />
            <XAxis dataKey={xKey} stroke="var(--app-muted)" fontSize={12} />
            <YAxis stroke="var(--app-muted)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey={yKey} fill="var(--app-primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function selectDashboardKind(user) {
  const slug = user?.role?.slug;
  if (slug === "super-admin") return "super";
  if (slug === "company-admin" || slug === "manager" || slug === "hr-partner") return "company";
  return "learner";
}

export { useSelector };
