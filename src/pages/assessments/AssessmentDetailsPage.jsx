import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Badge from "../../components/common/Badge";
import PageLoader from "../../components/common/Skeleton";
import { assessmentService } from "../../services/assessmentService";

export default function AssessmentDetailsPage() {
  const { id } = useParams();
  const actor = useSelector((state) => state.auth.user);
  const [item, setItem] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    assessmentService.getById(id, actor).then(setItem);
    assessmentService.getResults(actor).then((rows) => setResults(rows.filter((row) => row.assessmentId === Number(id))));
  }, [id, actor]);

  if (!item) return <PageLoader />;

  return (
    <div className="space-y-4">
      <PageHeader title={item.title} crumbs={[{ label: "Assessments", to: "/app/assessments" }, { label: item.title }]} />
      <Card title="Question bank">
        <ul className="space-y-2 text-sm">
          {item.questions.map((question) => (
            <li key={question.id} className="rounded-lg border border-border p-3">
              <div className="mb-1 flex justify-between gap-2">
                <span>{question.prompt}</span>
                <Badge>{question.type}</Badge>
              </div>
              {question.options?.length ? <p className="text-muted">{question.options.join(" · ")}</p> : null}
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Score history">
        <ul className="text-sm">
          {results.map((row) => (
            <li key={row.id}>
              User #{row.userId} · {row.score}% · {row.passed ? "Passed" : "Failed"} · attempt {row.attempt}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
