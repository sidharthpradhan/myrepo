import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Badge, { statusTone } from "../../components/common/Badge";
import Button from "../../components/common/Button";
import PageLoader from "../../components/common/Skeleton";
import { fetchCompany } from "../../store/slices/companySlice";
import { fetchUsers } from "../../store/slices/userSlice";
import { fetchCourses } from "../../store/slices/courseSlice";

export default function CompanyDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const company = useSelector((state) => state.companies.current);
  const users = useSelector((state) => state.users.items.filter((item) => item.companyId === Number(id)));
  const courses = useSelector((state) => state.courses.items.filter((item) => item.companyId === Number(id)));

  useEffect(() => {
    dispatch(fetchCompany(id));
    dispatch(fetchUsers());
    dispatch(fetchCourses());
  }, [dispatch, id]);

  if (!company) return <PageLoader />;

  return (
    <div className="space-y-4">
      <PageHeader
        title={company.name}
        crumbs={[
          { label: "Companies", to: "/app/companies" },
          { label: company.name },
        ]}
        actions={
          <Button variant="secondary" onClick={() => navigate("/app/companies")}>
            Back
          </Button>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Profile">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Industry</dt><dd>{company.industry}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Timezone</dt><dd>{company.timezone}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Email</dt><dd>{company.email}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Status</dt><dd><Badge tone={statusTone(company.status)}>{company.status}</Badge></dd></div>
          </dl>
        </Card>
        <Card title="Users">{users.length} people in this company</Card>
        <Card title="Courses">{courses.length} courses</Card>
      </div>
      <Card title="Settings">
        <pre className="overflow-x-auto text-sm text-muted">{JSON.stringify(company.settings, null, 2)}</pre>
      </Card>
    </div>
  );
}
