import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";

export default function HelpPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Help" description="Where to look in this repository." />
      <Card title="Find things quickly">
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Pages live in <code>src/pages</code></li>
          <li>Shared UI lives in <code>src/components</code></li>
          <li>Redux lives in <code>src/store</code></li>
          <li>JSON lives in <code>src/data</code></li>
          <li>Services live in <code>src/services</code></li>
          <li>Permissions live in <code>src/data/permissions.json</code> and <code>src/hooks/usePermissions.js</code></li>
          <li>Routes live in <code>src/routes/AppRoutes.jsx</code></li>
          <li>Theme lives in <code>src/constants/theme.js</code> and <code>src/store/slices/themeSlice.js</code></li>
        </ul>
      </Card>
    </div>
  );
}
