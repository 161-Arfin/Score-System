import type { AssessmentSection } from "@/features/assessment/types";

type AssessmentQuestionSectionProps = {
  answers: Record<string, number>;
  currentSectionIndex: number;
  onAnswerChange: (questionId: string, value: number) => void;
  section: AssessmentSection;
  totalSections: number;
};

export default function AssessmentQuestionSection({
  answers,
  currentSectionIndex,
  onAnswerChange,
  section,
  totalSections,
}: AssessmentQuestionSectionProps) {
  const answeredCount = section.questions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;
  const isCurrentSectionComplete = answeredCount === section.questions.length;
  const sectionSteps = Array.from({ length: totalSections }, (_, index) => {
    const sectionNumber = index + 1;
    const isCurrent = index === currentSectionIndex;
    const isComplete =
      index < currentSectionIndex || (isCurrent && isCurrentSectionComplete);

    return {
      isComplete,
      isCurrent,
      number: sectionNumber,
    };
  });

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#006B80]">
          {section.title}
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-950 sm:text-3xl">
          Pilih kondisi yang paling sesuai dengan keluarga Anda.
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-600">
          {section.subtitle}
        </p>
      </div>

      <div className="space-y-5">
        {section.questions.map((question) => (
          <fieldset
            key={question.id}
            className="rounded-lg border border-slate-200 bg-white px-5 py-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)]"
          >
            <legend className="sr-only">{question.indicator}</legend>
            <p className="text-center text-base font-semibold leading-7 text-slate-950">
              {question.indicator}
            </p>

            <div
              className="mt-6 grid gap-3"
              style={{
                gridTemplateColumns: `repeat(${question.options.length}, minmax(0, 1fr))`,
              }}
            >
              {question.options.map((option) => {
                const optionId = `${question.id}-${option.value}-${option.label}`;
                const isSelected = answers[question.id] === option.value;

                return (
                  <label
                    key={optionId}
                    htmlFor={optionId}
                    className={[
                      "flex min-h-[82px] cursor-pointer flex-col items-center justify-start gap-2 py-2 text-center transition sm:min-h-[90px]",
                      isSelected ? "scale-105" : "hover:scale-105",
                    ].join(" ")}
                  >
                    <input
                      id={optionId}
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={isSelected}
                      onChange={() => onAnswerChange(question.id, option.value)}
                      className="sr-only"
                    />
                    <span
                      className={[
                        "h-10 w-10 rounded-full border-2 transition",
                        isSelected
                          ? "border-[#006B80] bg-cyan-100 shadow-[0_0_0_6px_rgba(0,107,128,0.10)]"
                          : "border-slate-300 bg-white hover:border-[#006B80]/60 hover:bg-cyan-50",
                      ].join(" ")}
                    />
                    <span className="line-clamp-2 min-h-8 text-xs font-bold leading-4 text-slate-700">
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-8 px-1 sm:px-2">
        <div className="flex items-center">
          {sectionSteps.map((step, index) => (
            <div
              key={step.number}
              className="flex min-w-0 flex-1 items-center last:flex-none"
            >
              <div className="flex min-w-0 flex-col items-center gap-2">
                <span
                  className={[
                    "h-8 w-8 rounded-full border-2 transition sm:h-10 sm:w-10",
                    step.isComplete
                      ? "border-[#006B80] bg-[#006B80]"
                      : step.isCurrent
                        ? "border-slate-400 bg-slate-100"
                        : "border-slate-300 bg-white",
                  ].join(" ")}
                />
                <span
                  className={[
                    "text-center text-[11px] font-bold leading-tight sm:text-xs",
                    step.isComplete
                      ? "text-[#006B80]"
                      : step.isCurrent
                        ? "text-slate-600"
                        : "text-slate-400",
                  ].join(" ")}
                >
                  <span className="hidden sm:inline">Section </span>
                  {step.number}
                </span>
              </div>

              {index < sectionSteps.length - 1 ? (
                <div
                  className={[
                    "mx-1 mb-6 h-px flex-1 border-t-2 border-dashed sm:mx-3",
                    step.isComplete ? "border-[#006B80]" : "border-slate-300",
                  ].join(" ")}
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
