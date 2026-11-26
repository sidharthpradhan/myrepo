import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import LoadingButton from "../../components/common/LoadingButton";
import PageLoader from "../../components/common/Skeleton";
import { assessmentService } from "../../services/assessmentService";
import { notify } from "../../utils/notify";

export default function TakeAssessmentPage() {
  const { id } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [item, setItem] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    assessmentService.getById(id, user).then((assessment) => {
      const questions = assessment.randomize ? [...assessment.questions].sort(() => Math.random() - 0.5) : assessment.questions;
      setItem({ ...assessment, questions });
    });
  }, [id, user]);

  if (!item) return <PageLoader />;

  const toggle = (question, option, multiple) => {
    setAnswers((current) => {
      const existing = current[question.id] || [];
      if (question.type === "short" || question.type === "long") return { ...current, [question.id]: [option] };
      if (!multiple) return { ...current, [question.id]: [option] };
      const next = existing.includes(option) ? existing.filter((value) => value !== option) : [...existing, option];
      return { ...current, [question.id]: next };
    });
  };

  const submit = async () => {
    setSaving(true);
    try {
      const submitted = await assessmentService.submit(item.id, user.id, answers);
      setResult(submitted);
      notify.success(submitted.passed ? "Assessment completed" : "Score recorded");
    } catch (error) {
      notify.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title={item.title} description={`Passing score ${item.passingScore}% · ${item.timeLimitMinutes} minutes · ${item.attempts} attempts`} />
      {result ? (
        <Card title="Result">
          <p className="text-3xl font-semibold">{result.score}%</p>
          <p className="text-muted">{result.passed ? "You passed" : "Below passing score"}</p>
        </Card>
      ) : (
        item.questions.map((question) => (
          <Card key={question.id} title={question.prompt}>
            {question.type === "short" || question.type === "long" ? (
              <textarea
                className="w-full rounded-lg border border-border bg-surface p-3"
                rows={question.type === "long" ? 5 : 2}
                onChange={(event) => toggle(question, event.target.value)}
              />
            ) : (
              <div className="space-y-2">
                {question.options.map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm">
                    <input
                      type={question.type === "multiple" ? "checkbox" : "radio"}
                      name={question.id}
                      checked={(answers[question.id] || []).includes(option)}
                      onChange={() => toggle(question, option, question.type === "multiple")}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </Card>
        ))
      )}
      {!result ? (
        <LoadingButton loading={saving} loadingText="Submitting..." onClick={submit}>
          Submit
        </LoadingButton>
      ) : (
        <Button variant="secondary" onClick={() => setResult(null)}>
          Try again
        </Button>
      )}
    </div>
  );
}
