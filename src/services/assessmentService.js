import { db } from "./mockStore";
import { copy, delay, nextId } from "../utils/helpers";
import { createResourceService } from "./createResource";

const base = createResourceService("assessments");

export const assessmentService = {
  ...base,
  async getResults(actor) {
    await delay();
    if (!actor || actor.companyId == null) return copy(db.assessmentResults);
    const assessmentIds = db.assessments.filter((item) => item.companyId === actor.companyId).map((item) => item.id);
    return copy(db.assessmentResults.filter((item) => assessmentIds.includes(item.assessmentId)));
  },
  async submit(assessmentId, userId, answers) {
    await delay();
    const assessment = db.assessments.find((item) => item.id === Number(assessmentId));
    if (!assessment) throw new Error("Assessment not found.");
    let correct = 0;
    let scored = 0;
    assessment.questions.forEach((question) => {
      if (!question.answer?.length) return;
      scored += 1;
      const given = answers[question.id] || [];
      const expected = question.answer;
      const ok =
        expected.length === given.length && expected.every((value) => given.includes(value));
      if (ok) correct += 1;
    });
    const score = scored ? Math.round((correct / scored) * 100) : 0;
    const result = {
      id: nextId(db.assessmentResults),
      assessmentId: Number(assessmentId),
      userId,
      score,
      passed: score >= assessment.passingScore,
      attempt: db.assessmentResults.filter((item) => item.assessmentId === Number(assessmentId) && item.userId === userId).length + 1,
      takenAt: new Date().toISOString(),
    };
    db.assessmentResults.push(result);
    return copy(result);
  },
};
